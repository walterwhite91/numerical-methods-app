// Newton's forward / backward difference interpolation.
// Builds the finite-difference table and interpolates at a query point.

export interface InterpPoint {
  x: number;
  y: number;
}

export interface InterpGraph {
  type: "interp";
  curve: InterpPoint[]; // sampled interpolating polynomial
  points: InterpPoint[]; // original data points
  target: InterpPoint | null; // interpolated (xq, yq)
  xLabel: string;
  yLabel: string;
}

// forward difference table: table[i][j] = Δ^j y_i  (valid for i < n - j)
function buildDifferenceTable(y: number[]): number[][] {
  const n = y.length;
  const table: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) table[i][0] = y[i];
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      table[i][j] = table[i + 1][j - 1] - table[i][j - 1];
    }
  }
  return table;
}

// Evaluate Newton forward polynomial at an arbitrary xq.
function evalForward(x: number[], table: number[][], h: number, xq: number): number {
  const n = x.length;
  const p = (xq - x[0]) / h;
  let sum = table[0][0];
  let pterm = 1;
  for (let k = 1; k < n; k++) {
    pterm *= (p - (k - 1)) / k;
    sum += pterm * table[0][k];
  }
  return sum;
}

// Evaluate Newton backward polynomial at an arbitrary xq.
function evalBackward(x: number[], table: number[][], h: number, xq: number): number {
  const n = x.length;
  const p = (xq - x[n - 1]) / h;
  let sum = table[n - 1][0];
  let pterm = 1;
  for (let k = 1; k < n; k++) {
    pterm *= (p + (k - 1)) / k;
    sum += pterm * table[n - 1 - k][k];
  }
  return sum;
}

function almostEqual(a: number, b: number, tol: number): boolean {
  return Math.abs(a - b) <= tol;
}

function differenceMethod(
  xIn: number[],
  yIn: number[],
  xq: number,
  direction: "forward" | "backward"
) {
  if (xIn.length < 2 || xIn.length !== yIn.length) {
    return {
      success: false,
      message: "Provide at least 2 matching x and y values.",
    };
  }

  const n = xIn.length;
  const h = xIn[1] - xIn[0];

  // verify equal spacing (required for forward/backward difference formulae)
  const tolH = Math.abs(h) * 1e-6 + 1e-9;
  for (let i = 1; i < n; i++) {
    if (!almostEqual(xIn[i] - xIn[i - 1], h, tolH)) {
      return {
        success: false,
        message:
          "x values must be equally spaced for Newton's forward/backward difference interpolation.",
      };
    }
  }

  const table = buildDifferenceTable(yIn);
  const evalFn = direction === "forward" ? evalForward : evalBackward;
  const interpolated = evalFn(xIn, table, h, xq);

  const anchorIdx = direction === "forward" ? 0 : n - 1;
  const p = (xq - xIn[anchorIdx]) / h;

  // ── calculation steps (LaTeX) ────────────────────────────────────────────
  const sym = direction === "forward" ? "\\Delta" : "\\nabla";
  const anchorSub = direction === "forward" ? "0" : "n";
  const steps: string[] = [];
  steps.push(
    direction === "forward"
      ? String.raw`p = \frac{x - x_0}{h} = \frac{${xq} - ${xIn[0]}}{${h}} = ${p.toFixed(4)}`
      : String.raw`p = \frac{x - x_n}{h} = \frac{${xq} - ${xIn[n - 1]}}{${h}} = ${p.toFixed(4)}`
  );

  const formula =
    direction === "forward"
      ? String.raw`y_p = y_0 + p\,\Delta y_0 + \frac{p(p-1)}{2!}\Delta^2 y_0 + \cdots`
      : String.raw`y_p = y_n + p\,\nabla y_n + \frac{p(p+1)}{2!}\nabla^2 y_n + \cdots`;
  steps.push(formula);

  // numeric expansion, term by term
  let sum = table[anchorIdx][0];
  let pterm = 1;
  let expansion = `${table[anchorIdx][0].toFixed(4)}`;
  for (let k = 1; k < n; k++) {
    pterm *= (p - (direction === "forward" ? k - 1 : -(k - 1))) / k;
    const diff = direction === "forward" ? table[0][k] : table[n - 1 - k][k];
    sum += pterm * diff;
    expansion += ` ${pterm * diff >= 0 ? "+" : "-"} ${Math.abs(pterm * diff).toFixed(4)}`;
  }
  steps.push(String.raw`y_p = ${expansion}`);
  steps.push(String.raw`y_p = ${interpolated.toFixed(6)}`);

  // ── graph: sample interpolating polynomial across the data range ──────────
  const xMin = Math.min(xIn[0], xIn[n - 1], xq);
  const xMax = Math.max(xIn[0], xIn[n - 1], xq);
  const pad = (xMax - xMin) * 0.05 || Math.abs(h);
  const lo = xMin - pad;
  const hi = xMax + pad;
  const samples = 80;
  const curve: InterpPoint[] = [];
  for (let s = 0; s <= samples; s++) {
    const cx = lo + ((hi - lo) * s) / samples;
    curve.push({ x: cx, y: evalFn(xIn, table, h, cx) });
  }

  const graph: InterpGraph = {
    type: "interp",
    curve,
    points: xIn.map((x, i) => ({ x, y: yIn[i] })),
    target: { x: xq, y: interpolated },
    xLabel: "x",
    yLabel: "y",
  };

  return {
    success: true,
    message: `Interpolated value at x = ${xq}.`,
    direction,
    h,
    p,
    x: xIn,
    y: yIn,
    diff_table: table,
    interpolated_value: interpolated,
    calculation_steps: steps,
    graph,
  };
}

export function forwardDifferenceMethod(x: number[], y: number[], xq: number) {
  return differenceMethod(x, y, xq, "forward");
}

export function backwardDifferenceMethod(x: number[], y: number[], xq: number) {
  return differenceMethod(x, y, xq, "backward");
}
