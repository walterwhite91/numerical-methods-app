'use client';

import React, { useState } from 'react';
import MathDisplay from '@/components/MathDisplay';

const API_BASE = 'http://localhost:8000/api';

export default function SolverPage() {
  const [method, setMethod] = useState('bisection');
  const [params, setParams] = useState<Record<string, any>>({
    func_str: 'x**3 - x - 1',
    deriv_str: '3*x**2 - 1',
    deriv2_str: '6*x',
    a: 1.0,
    b: 2.0,
    x0: 1.5,
    x1: 2.0,
    h: 0.1,
    steps_count: 5,
    n: 4,
    tol: 1e-6,
    max_iter: 50
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (key: string, val: any) => {
    setParams(prev => ({
      ...prev,
      [key]: val
    }));
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
      max_iter: Number(params.max_iter)
    };

    // Construct endpoint URL and payload based on selected method
    if (['bisection', 'false-position'].includes(method)) {
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
      payload.deriv2_str = params.deriv2_str;
      payload.x0 = Number(params.x0);
    } else if (['euler', 'modified-euler', 'rk4'].includes(method)) {
      url = `${API_BASE}/ode/${method}`;
      payload = {
        func_str: params.func_str,
        x0: Number(params.x0),
        y0: Number(params.x0), // Using x0 for simplicity or mapping custom
        h: Number(params.h),
        steps_count: Number(params.steps_count)
      };
      // Map custom variables properly
      payload.y0 = Number(params.x1); // Map to y0
    } else if (['trapezoidal', 'simpson-13', 'simpson-38'].includes(method)) {
      url = `${API_BASE}/integration`;
      payload = {
        func_str: params.func_str,
        a: Number(params.a),
        b: Number(params.b),
        n: Number(params.n),
        method: method.replace('-', '_')
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        setError(data.message || 'Error occurred during calculation.');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError('Could not connect to the backend server. Please verify it is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Step-by-Step Solver</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
        
        {/* Input Panel */}
        <section>
          <form onSubmit={handleSolve} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">Select Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="input-field"
              >
                <optgroup label="Root Finding">
                  <option value="bisection">Bisection Method</option>
                  <option value="secant">Secant Method</option>
                  <option value="false-position">False Position Method</option>
                  <option value="newton-raphson">Newton-Raphson Method</option>
                  <option value="generalized-newton">Generalized Newton-Raphson</option>
                </optgroup>
                <optgroup label="Ordinary Differential Equations">
                  <option value="euler">Euler's Method</option>
                  <option value="modified-euler">Modified Euler Method</option>
                  <option value="rk4">Runge-Kutta 4th Order (RK4)</option>
                </optgroup>
                <optgroup label="Numerical Integration">
                  <option value="trapezoidal">Trapezoidal Rule</option>
                  <option value="simpson-13">Simpson's 1/3 Rule</option>
                  <option value="simpson-38">Simpson's 3/8 Rule</option>
                </optgroup>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Function f(x) or f(x, y)</label>
              <input
                type="text"
                className="input-field"
                value={params.func_str}
                onChange={(e) => handleInputChange('func_str', e.target.value)}
                placeholder="e.g. x**3 - x - 1"
                required
              />
            </div>

            {method === 'newton-raphson' && (
              <div className="input-group">
                <label className="input-label">First Derivative f'(x)</label>
                <input
                  type="text"
                  className="input-field"
                  value={params.deriv_str}
                  onChange={(e) => handleInputChange('deriv_str', e.target.value)}
                  placeholder="e.g. 3*x**2 - 1"
                  required
                />
              </div>
            )}

            {method === 'generalized-newton' && (
              <>
                <div className="input-group">
                  <label className="input-label">First Derivative f'(x)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={params.deriv_str}
                    onChange={(e) => handleInputChange('deriv_str', e.target.value)}
                    placeholder="e.g. 3*x**2 - 1"
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Second Derivative f''(x)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={params.deriv2_str}
                    onChange={(e) => handleInputChange('deriv2_str', e.target.value)}
                    placeholder="e.g. 6*x"
                    required
                  />
                </div>
              </>
            )}

            {['bisection', 'false-position', 'trapezoidal', 'simpson-13', 'simpson-38'].includes(method) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Lower bound (a)</label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    value={params.a}
                    onChange={(e) => handleInputChange('a', e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Upper bound (b)</label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    value={params.b}
                    onChange={(e) => handleInputChange('b', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {['secant', 'euler', 'modified-euler', 'rk4'].includes(method) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">{['euler', 'modified-euler', 'rk4'].includes(method) ? 'x0' : 'Initial guess x0'}</label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    value={params.x0}
                    onChange={(e) => handleInputChange('x0', e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">{['euler', 'modified-euler', 'rk4'].includes(method) ? 'y0' : 'Initial guess x1'}</label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    value={params.x1}
                    onChange={(e) => handleInputChange('x1', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {['newton-raphson', 'generalized-newton'].includes(method) && (
              <div className="input-group">
                <label className="input-label">Initial Guess (x0)</label>
                <input
                  type="number"
                  step="any"
                  className="input-field"
                  value={params.x0}
                  onChange={(e) => handleInputChange('x0', e.target.value)}
                  required
                />
              </div>
            )}

            {['euler', 'modified-euler', 'rk4'].includes(method) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Step size (h)</label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    value={params.h}
                    onChange={(e) => handleInputChange('h', e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Steps Count</label>
                  <input
                    type="number"
                    className="input-field"
                    value={params.steps_count}
                    onChange={(e) => handleInputChange('steps_count', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {['trapezoidal', 'simpson-13', 'simpson-38'].includes(method) && (
              <div className="input-group">
                <label className="input-label">Subintervals (n)</label>
                <input
                  type="number"
                  className="input-field"
                  value={params.n}
                  onChange={(e) => handleInputChange('n', e.target.value)}
                  required
                />
              </div>
            )}

            {['bisection', 'secant', 'false-position', 'newton-raphson', 'generalized-newton'].includes(method) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Tolerance</label>
                  <input
                    type="number"
                    step="any"
                    className="input-field"
                    value={params.tol}
                    onChange={(e) => handleInputChange('tol', e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Max Iter</label>
                  <input
                    type="number"
                    className="input-field"
                    value={params.max_iter}
                    onChange={(e) => handleInputChange('max_iter', e.target.value)}
                    required
                  />
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
              {/* Highlighted Result Banner */}
              <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '0.25rem' }}>Final Solution</h3>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                  {result.root !== undefined ? `Root = ${result.root}` : null}
                  {result.integral !== undefined ? `Integral = ${result.integral}` : null}
                  {result.final_y !== undefined ? `y(${result.final_x}) = ${result.final_y}` : null}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  {result.message}
                </p>
              </div>

              {/* Table or iterations */}
              {result.steps && result.steps.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Step-by-step Iteration Details</h3>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          {Object.keys(result.steps[0]).map((key) => (
                            <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.steps.map((step: any, idx: number) => (
                          <tr key={idx}>
                            {Object.values(step).map((val: any, sIdx) => (
                              <td key={sIdx}>
                                {typeof val === 'number' ? val.toFixed(6) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Integration value tables */}
              {result.table && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Computed Value Points</h3>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Index (i)</th>
                          <th>x</th>
                          <th>y</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.table.map((row: any, idx: number) => (
                          <tr key={idx}>
                            <td>{row.i}</td>
                            <td>{row.x.toFixed(6)}</td>
                            <td>{row.y.toFixed(6)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Integration calculation steps */}
              {result.calculation_steps && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Calculation Steps</h3>
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {result.calculation_steps.map((stepStr: string, idx: number) => (
                      <div key={idx} style={{ padding: '0.5rem 0', borderBottom: idx < result.calculation_steps.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                        <span style={{ fontWeight: '500', marginRight: '0.5rem', color: 'var(--text-secondary)' }}>Step {idx + 1}:</span>
                        <code>{stepStr}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Configure parameters on the left and click "Solve" to calculate the solution step-by-step.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
