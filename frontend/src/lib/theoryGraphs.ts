// Illustrative graphs for the Method Explorer (theory) pages.
// These are static, self-contained examples computed client-side — no API call.
// One representative graph per graphable category / method.
import type { GraphData } from '@/components/MethodGraph';

interface Pt { x: number; y: number; }

function sample(f: (x: number) => number, lo: number, hi: number, n = 120): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const x = lo + ((hi - lo) * i) / n;
    const y = f(x);
    if (Number.isFinite(y)) pts.push({ x, y });
  }
  return pts;
}

// ── Root finding: f(x) = x^3 - x - 1, root ≈ 1.3247, with bisection iterates ──
function rootGraph(): GraphData {
  const f = (x: number) => x ** 3 - x - 1;
  let a = 1, b = 2;
  const approxPoints: Pt[] = [];
  for (let i = 0; i < 6; i++) {
    const m = (a + b) / 2;
    approxPoints.push({ x: m, y: f(m) });
    if (f(a) * f(m) < 0) b = m; else a = m;
  }
  return {
    type: 'root',
    curve: sample(f, 0, 2),
    root: 1.3247179572,
    approxPoints,
    xLabel: 'x',
    yLabel: 'f(x)',
  };
}

// ── Interpolation: data on y = x^3, Newton polynomial through the points ──────
function interpGraph(): GraphData {
  const x = [1, 2, 3, 4, 5];
  const y = x.map((v) => v ** 3);
  const n = x.length;
  const h = 1;
  const t: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) t[i][0] = y[i];
  for (let j = 1; j < n; j++) for (let i = 0; i < n - j; i++) t[i][j] = t[i + 1][j - 1] - t[i][j - 1];
  const evalFwd = (xq: number) => {
    let p = (xq - x[0]) / h, s = t[0][0], pt = 1;
    for (let k = 1; k < n; k++) { pt *= (p - (k - 1)) / k; s += pt * t[0][k]; }
    return s;
  };
  return {
    type: 'interp',
    curve: sample(evalFwd, 0.8, 5.2),
    points: x.map((v, i) => ({ x: v, y: y[i] })),
    target: { x: 2.5, y: evalFwd(2.5) },
    xLabel: 'x',
    yLabel: 'y',
  };
}

// ── ODE: y' = x + y, y(0) = 1, Euler steps traced as the solution polyline ────
function odeGraph(): GraphData {
  const f = (x: number, y: number) => x + y;
  let x = 0, y = 1;
  const h = 0.2, steps = 10;
  const points: Pt[] = [{ x, y }];
  for (let i = 0; i < steps; i++) {
    y = y + h * f(x, y);
    x = x + h;
    points.push({ x, y });
  }
  return { type: 'ode', points, xLabel: 'x', yLabel: 'y' };
}

// ── Integration: f(x) = 1/(1+x^2) on [0,1], strips under the curve ────────────
function integrationGraph(): GraphData {
  const f = (x: number) => 1 / (1 + x * x);
  const a = 0, b = 1, n = 4, h = (b - a) / n;
  const points: Pt[] = [];
  for (let i = 0; i <= n; i++) { const xi = a + i * h; points.push({ x: xi, y: f(xi) }); }
  return { type: 'integration', curve: sample(f, a, b), points, xLabel: 'x', yLabel: 'f(x)' };
}

// ── Curve fitting: scatter (noisy samples) + the underlying fitted curve ───────
function fitGraph(kind: 'linear' | 'parabolic' | 'exponential'): GraphData {
  const fns = {
    linear: (x: number) => 2 * x + 1,
    parabolic: (x: number) => 0.5 * x * x - x + 2,
    exponential: (x: number) => 2 * Math.exp(0.4 * x),
  };
  const f = fns[kind];
  const noise = [0.4, -0.35, 0.5, -0.3, 0.45, -0.5, 0.35];
  const xs = [1, 2, 3, 4, 5, 6, 7];
  const points = xs.map((x, i) => ({ x, y: f(x) + noise[i] }));
  return {
    type: 'interp',
    curve: sample(f, 0.8, 7.2),
    points,
    target: null,
    xLabel: 'x',
    yLabel: 'y',
  };
}

export function getTheoryGraph(methodId: string, categoryId: string): GraphData | null {
  if (categoryId === 'curve-fitting') {
    if (methodId === 'linear-fit') return fitGraph('linear');
    if (methodId === 'parabolic-fit') return fitGraph('parabolic');
    if (methodId === 'exponential-fit') return fitGraph('exponential');
    return fitGraph('linear');
  }
  switch (categoryId) {
    case 'root-finding': return rootGraph();
    case 'finite-differences': return interpGraph();
    case 'ode': return odeGraph();
    case 'integration': return integrationGraph();
    default: return null;
  }
}

export function theoryGraphCaption(type: GraphData['type'], categoryId: string): string {
  if (categoryId === 'curve-fitting')
    return 'Illustrative example: scattered data points and the fitted curve that minimises the squared error.';
  switch (type) {
    case 'root':
      return 'Illustrative example f(x) = x³ − x − 1. The dashed green line marks the root; orange dots show successive approximations closing in on it.';
    case 'interp':
      return 'Illustrative example: blue dots are the tabulated data points, the curve is the interpolating polynomial, the red point is an interpolated value.';
    case 'ode':
      return 'Illustrative example y′ = x + y, y(0) = 1. Markers trace the step-by-step numerical solution.';
    case 'integration':
      return 'Illustrative example f(x) = 1/(1+x²). Shaded strips are the area approximated under the curve.';
    default:
      return '';
  }
}
