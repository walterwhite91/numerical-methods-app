'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MathDisplay from '@/components/MathDisplay';
import MethodGraph from '@/components/MethodGraph';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api`;

const INTERP_METHODS = ['forward-difference', 'backward-difference'];

const DEFAULT_PARAMS = {
  func_str: 'x**3 - x - 1',
  deriv_str: '3*x**2 - 1',
  multiplicity: 1,
  true_val: 3.141592,
  approx_val: 3.14,
  a: 1.0,
  b: 2.0,
  x0: 1.5,
  x1: 2.0,
  h: 0.1,
  steps_count: 5,
  n: 4,
  tol: 1e-6,
  max_iter: 50,
  x_values: '1, 2, 3, 4, 5',
  y_values: '1, 8, 27, 64, 125',
  xq: 2.5,
};

// Unicode superscripts for difference-order headers (Δ², ∇³, …).
const SUP = ['', '', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰'];

const fmtCell = (v: number) => Number(v.toFixed(4)).toString();

// Staggered finite-difference table: each Δ^k y sits vertically centered
// between the two entries it was computed from (classic diagonal layout).
function DiagonalDiffTable({ x, table, direction }: {
  x: number[]; table: number[][]; direction: string;
}) {
  const n = x.length;
  const sym = direction === 'backward' ? '∇' : 'Δ';
  const cols = n + 1;               // col 0 = x, cols 1..n = difference orders 0..n-1
  const rows = 2 * n - 1;
  const grid: (string | null)[][] = Array.from({ length: rows }, () => new Array(cols).fill(null));

  for (let i = 0; i < n; i++) grid[2 * i][0] = fmtCell(x[i]);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      grid[2 * i + j][j + 1] = fmtCell(table[i][j]);
    }
  }

  const header = ['x', 'y'];
  for (let k = 1; k < n; k++) header.push(`${sym}${SUP[k]}y`);

  return (
    <div className="table-container">
      <table style={{ textAlign: 'center' }}>
        <thead><tr>{header.map((h, i) => <th key={i} style={{ textAlign: 'center' }}>{h}</th>)}</tr></thead>
        <tbody>
          {grid.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} style={{
                  color: c >= 2 && cell !== null ? '#2563eb' : undefined,
                  fontWeight: c >= 2 && cell !== null ? 600 : undefined,
                  borderBottom: 'none',
                }}>{cell ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SolverContent() {
  const searchParams = useSearchParams();
  const [method, setMethod] = useState('bisection');
  const [params, setParams] = useState<Record<string, any>>(DEFAULT_PARAMS);
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [prefillNote, setPrefillNote] = useState<string | null>(null);

  // On mount, check for ?method= and ?qid= params to pre-fill from API
  useEffect(() => {
    const urlMethod = searchParams.get('method');
    const urlQid = searchParams.get('qid');
    const urlCategory = searchParams.get('category');

    if (urlMethod) setMethod(urlMethod);

    if (urlQid) {
      setPrefilling(true);
      setPrefillNote(null);
      fetch(`${API_BASE}/past-qna/${urlQid}/solver-params`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.params) {
            const p = data.params;
            setParams(prev => ({
              ...prev,
              ...(p.func_str    && { func_str:    p.func_str }),
              ...(p.deriv_str   && { deriv_str:   p.deriv_str }),
              ...(p.a           !== undefined && { a:           p.a }),
              ...(p.b           !== undefined && { b:           p.b }),
              ...(p.x0          !== undefined && { x0:          p.x0 }),
              ...(p.y0          !== undefined && { x1:          p.y0 }),   // solver uses x1 for y0
              ...(p.h           !== undefined && { h:           p.h }),
              ...(p.n           !== undefined && { n:           p.n }),
              ...(p.steps_count !== undefined && { steps_count: p.steps_count }),
              ...(p.tol         !== undefined && { tol:         p.tol }),
              ...(p.max_iter    !== undefined && { max_iter:    p.max_iter }),
              ...(p.multiplicity!== undefined && { multiplicity:p.multiplicity }),
            }));
            if (p.method) setMethod(p.method);
            setPrefillNote('Inputs pre-filled from the past exam question.');
          }
        })
        .catch(() => setPrefillNote('Could not auto-fill inputs — please enter them manually.'))
        .finally(() => setPrefilling(false));
    } else if (urlMethod) {
      setMethod(urlMethod);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (key: string, val: any) => {
    setParams(prev => ({ ...prev, [key]: val }));
  };

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    let url = '';
    let payload: Record<string, any> = {
      func_str: params.func_str,
      tol: Number(params.tol),
      max_iter: Number(params.max_iter),
    };

    if (method === 'error-calculation') {
      const tv = Number(params.true_val);
      const av = Number(params.approx_val);
      const ea = Math.abs(tv - av);
      const er = tv !== 0 ? Math.abs((tv - av) / tv) : 0;
      setResult({
        success: true,
        message: 'Error computed.',
        error_results: { absolute_error: ea, relative_error: er, percentage_error: er * 100 },
      });
      setLoading(false);
      return;
    }

    if (INTERP_METHODS.includes(method)) {
      const x = String(params.x_values).split(',').map(s => Number(s.trim())).filter(s => !Number.isNaN(s));
      const y = String(params.y_values).split(',').map(s => Number(s.trim())).filter(s => !Number.isNaN(s));
      url = `${API_BASE}/interpolation/${method}`;
      payload = { x, y, xq: Number(params.xq) };
    } else if (['bisection', 'false-position'].includes(method)) {
      url = `${API_BASE}/root-finding/${method}`;
      payload.a = Number(params.a);
      payload.b = Number(params.b);
    } else if (method === 'secant') {
      url = `${API_BASE}/root-finding/secant`;
      payload.x0 = Number(params.x0);
      payload.x1 = Number(params.x1);
    } else if (method === 'newton-raphson') {
      url = `${API_BASE}/root-finding/newton-raphson`;
      payload.deriv_str = params.deriv_str;
      payload.x0 = Number(params.x0);
    } else if (method === 'generalized-newton') {
      url = `${API_BASE}/root-finding/generalized-newton`;
      payload.deriv_str = params.deriv_str;
      payload.multiplicity = Number(params.multiplicity);
      payload.x0 = Number(params.x0);
    } else if (['euler', 'modified-euler', 'rk4'].includes(method)) {
      url = `${API_BASE}/ode/${method}`;
      payload = {
        func_str: params.func_str,
        x0: Number(params.x0),
        y0: Number(params.x1),
        h: Number(params.h),
        steps_count: Number(params.steps_count),
      };
    } else if (['trapezoidal', 'simpson-13', 'simpson-38'].includes(method)) {
      url = `${API_BASE}/integration`;
      payload = {
        func_str: params.func_str,
        a: Number(params.a),
        b: Number(params.b),
        n: Number(params.n),
        method: method.replace('-', '_'),
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        setError(data.message || 'Error occurred during calculation.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Could not connect to the backend server. Please verify it is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Step-by-Step Solver</h1>

      {prefilling && (
        <div style={{ padding: '0.75rem 1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.87rem', color: '#1d4ed8' }}>
          Loading inputs from past exam question…
        </div>
      )}
      {prefillNote && !prefilling && (
        <div style={{ padding: '0.75rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.87rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
          {prefillNote}
        </div>
      )}

      <div className="solver-grid">
        {/* Input Panel */}
        <section>
          <form onSubmit={handleSolve} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">Select Method</label>
              <select value={method} onChange={e => setMethod(e.target.value)} className="input-field">
                <optgroup label="Detection of Error">
                  <option value="error-calculation">Absolute &amp; Relative Error</option>
                </optgroup>
                <optgroup label="Roots of Equations">
                  <option value="bisection">Bisection Method</option>
                  <option value="secant">Secant Method</option>
                  <option value="false-position">False Position Method</option>
                  <option value="newton-raphson">Newton-Raphson Method</option>
                  <option value="generalized-newton">Generalized Newton-Raphson</option>
                </optgroup>
                <optgroup label="Ordinary Differential Equations">
                  <option value="euler">Euler&apos;s Method</option>
                  <option value="modified-euler">Modified Euler Method</option>
                  <option value="rk4">Runge-Kutta 4th Order (RK4)</option>
                </optgroup>
                <optgroup label="Numerical Integration">
                  <option value="trapezoidal">Trapezoidal Rule</option>
                  <option value="simpson-13">Simpson&apos;s 1/3 Rule</option>
                  <option value="simpson-38">Simpson&apos;s 3/8 Rule</option>
                </optgroup>
                <optgroup label="Interpolation">
                  <option value="forward-difference">Newton&apos;s Forward Difference</option>
                  <option value="backward-difference">Newton&apos;s Backward Difference</option>
                </optgroup>
              </select>
            </div>

            {method !== 'error-calculation' && !INTERP_METHODS.includes(method) && (
              <div className="input-group">
                <label className="input-label">Function f(x) or f(x, y)</label>
                <input type="text" className="input-field" value={params.func_str}
                  onChange={e => handleInputChange('func_str', e.target.value)}
                  placeholder="e.g. x**3 - x - 1" required />
              </div>
            )}

            {INTERP_METHODS.includes(method) && (
              <>
                <div className="input-group">
                  <label className="input-label">x values (comma-separated, equally spaced)</label>
                  <input type="text" className="input-field" value={params.x_values}
                    onChange={e => handleInputChange('x_values', e.target.value)}
                    placeholder="e.g. 1, 2, 3, 4, 5" required />
                </div>
                <div className="input-group">
                  <label className="input-label">y values (comma-separated)</label>
                  <input type="text" className="input-field" value={params.y_values}
                    onChange={e => handleInputChange('y_values', e.target.value)}
                    placeholder="e.g. 1, 8, 27, 64, 125" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Interpolate at x =</label>
                  <input type="number" step="any" className="input-field" value={params.xq}
                    onChange={e => handleInputChange('xq', e.target.value)} required />
                </div>
              </>
            )}

            {method === 'error-calculation' && (
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">True Value (X)</label>
                  <input type="number" step="any" className="input-field" value={params.true_val}
                    onChange={e => handleInputChange('true_val', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Approximate Value (Xa)</label>
                  <input type="number" step="any" className="input-field" value={params.approx_val}
                    onChange={e => handleInputChange('approx_val', e.target.value)} required />
                </div>
              </div>
            )}

            {method === 'newton-raphson' && (
              <div className="input-group">
                <label className="input-label">First Derivative f&apos;(x)</label>
                <input type="text" className="input-field" value={params.deriv_str}
                  onChange={e => handleInputChange('deriv_str', e.target.value)}
                  placeholder="e.g. 3*x**2 - 1" required />
              </div>
            )}

            {method === 'generalized-newton' && (
              <>
                <div className="input-group">
                  <label className="input-label">First Derivative f&apos;(x)</label>
                  <input type="text" className="input-field" value={params.deriv_str}
                    onChange={e => handleInputChange('deriv_str', e.target.value)}
                    placeholder="e.g. 3*x**2 - 1" required />
                </div>
                <div className="input-group">
                  <label className="input-label">Multiplicity (m)</label>
                  <input type="number" className="input-field" value={params.multiplicity}
                    onChange={e => handleInputChange('multiplicity', e.target.value)}
                    placeholder="e.g. 2" required />
                </div>
              </>
            )}

            {['bisection', 'false-position', 'trapezoidal', 'simpson-13', 'simpson-38'].includes(method) && (
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Lower bound (a)</label>
                  <input type="number" step="any" className="input-field" value={params.a}
                    onChange={e => handleInputChange('a', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Upper bound (b)</label>
                  <input type="number" step="any" className="input-field" value={params.b}
                    onChange={e => handleInputChange('b', e.target.value)} required />
                </div>
              </div>
            )}

            {['secant', 'euler', 'modified-euler', 'rk4'].includes(method) && (
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">{['euler', 'modified-euler', 'rk4'].includes(method) ? 'x₀' : 'Initial guess x₀'}</label>
                  <input type="number" step="any" className="input-field" value={params.x0}
                    onChange={e => handleInputChange('x0', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">{['euler', 'modified-euler', 'rk4'].includes(method) ? 'y₀' : 'Initial guess x₁'}</label>
                  <input type="number" step="any" className="input-field" value={params.x1}
                    onChange={e => handleInputChange('x1', e.target.value)} required />
                </div>
              </div>
            )}

            {['newton-raphson', 'generalized-newton'].includes(method) && (
              <div className="input-group">
                <label className="input-label">Initial Guess (x₀)</label>
                <input type="number" step="any" className="input-field" value={params.x0}
                  onChange={e => handleInputChange('x0', e.target.value)} required />
              </div>
            )}

            {['euler', 'modified-euler', 'rk4'].includes(method) && (
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Step size (h)</label>
                  <input type="number" step="any" className="input-field" value={params.h}
                    onChange={e => handleInputChange('h', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Steps Count</label>
                  <input type="number" className="input-field" value={params.steps_count}
                    onChange={e => handleInputChange('steps_count', e.target.value)} required />
                </div>
              </div>
            )}

            {['trapezoidal', 'simpson-13', 'simpson-38'].includes(method) && (
              <div className="input-group">
                <label className="input-label">Subintervals (n)</label>
                <input type="number" className="input-field" value={params.n}
                  onChange={e => handleInputChange('n', e.target.value)} required />
              </div>
            )}

            {['bisection', 'secant', 'false-position', 'newton-raphson', 'generalized-newton'].includes(method) && (
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Tolerance</label>
                  <input type="number" step="any" className="input-field" value={params.tol}
                    onChange={e => handleInputChange('tol', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Max Iter</label>
                  <input type="number" className="input-field" value={params.max_iter}
                    onChange={e => handleInputChange('max_iter', e.target.value)} required />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', color: 'white' }} disabled={loading}>
              {loading ? 'Calculating...' : 'Solve'}
            </button>
          </form>
        </section>

        {/* Output Panel */}
        <section>
          {error && (
            <div style={{ padding: '1.5rem', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-lg)', color: '#991b1b', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: '#991b1b' }}>Calculation Error</h3>
              <p style={{ fontSize: '0.95rem' }}>{error}</p>
            </div>
          )}

          {result ? (
            <div>
              <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '0.25rem' }}>Final Solution</h3>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                  {result.root !== undefined && result.root !== null ? `Root = ${result.root}` : null}
                  {result.integral !== undefined ? `Integral = ${result.integral}` : null}
                  {result.final_y !== undefined ? `y(${result.final_x}) = ${result.final_y}` : null}
                  {result.interpolated_value !== undefined ? `y(${params.xq}) = ${Number(result.interpolated_value).toFixed(6)}` : null}
                  {result.error_results !== undefined ? (
                    <div style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>
                      <div>Absolute Error: {result.error_results.absolute_error.toExponential(4)}</div>
                      <div>Relative Error: {result.error_results.relative_error.toExponential(4)}</div>
                      <div>Percentage Error: {result.error_results.percentage_error.toFixed(4)}%</div>
                    </div>
                  ) : null}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{result.message}</p>
              </div>

              {result.diff_table && result.x && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Difference Table</h3>
                  <DiagonalDiffTable x={result.x} table={result.diff_table} direction={result.direction} />
                </div>
              )}

              {result.graph && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Graphical Interpretation</h3>
                  <MethodGraph graph={result.graph} />
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {result.graph.type === 'root' && 'Blue curve is f(x); the dashed green line marks the root, orange dots the successive iterate approximations.'}
                    {result.graph.type === 'ode' && 'Blue markers trace the numerical solution y(x) step by step.'}
                    {result.graph.type === 'integration' && 'Shaded strips are the area approximated under f(x).'}
                    {result.graph.type === 'interp' && 'Blue dots are the data points, the curve is the interpolating polynomial, the red point is the interpolated value.'}
                  </p>
                </div>
              )}

              {result.steps && result.steps.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Step-by-step Iteration Details</h3>
                  <div className="table-container">
                    <table>
                      <thead><tr>{Object.keys(result.steps[0]).map(key => <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>)}</tr></thead>
                      <tbody>
                        {result.steps.map((step: any, idx: number) => (
                          <tr key={idx}>{Object.values(step).map((val: any, sIdx) => (
                            <td key={sIdx}>{typeof val === 'number' ? val.toFixed(6) : String(val)}</td>
                          ))}</tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {result.table && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Computed Value Points</h3>
                  <div className="table-container">
                    <table>
                      <thead><tr><th>Index (i)</th><th>x</th><th>y</th></tr></thead>
                      <tbody>
                        {result.table.map((row: any, idx: number) => (
                          <tr key={idx}><td>{row.i}</td><td>{row.x.toFixed(6)}</td><td>{row.y.toFixed(6)}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {result.calculation_steps && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Calculation Steps</h3>
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {result.calculation_steps.map((stepStr: string, idx: number) => (
                      <div key={idx} style={{ padding: '0.5rem 0', borderBottom: idx < result.calculation_steps.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                        <span style={{ fontWeight: '500', marginRight: '0.5rem', color: 'var(--text-secondary)' }}>Step {idx + 1}:</span>
                        <div style={{ display: 'inline-block', verticalAlign: 'middle', overflowX: 'auto', maxWidth: '100%' }}>
                          <MathDisplay math={stepStr} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Configure parameters on the left and click &quot;Solve&quot; to calculate the solution step-by-step.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function SolverPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading solver…</div>}>
      <SolverContent />
    </Suspense>
  );
}
