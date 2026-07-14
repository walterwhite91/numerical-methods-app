// Builds lightweight plot data attached to solver responses so the frontend
// can draw a graphical interpretation without re-evaluating expressions.
import { evaluateFunction } from "./exprEval";

export interface Pt {
  x: number;
  y: number;
}

const X_KEYS = ["a", "b", "c", "midpoint", "x", "x_prev", "x_curr", "x_new"];

function sampleCurve(funcStr: string, lo: number, hi: number, samples = 140): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = lo + ((hi - lo) * i) / samples;
    let y: number;
    try {
      y = evaluateFunction(funcStr, x);
    } catch {
      continue;
    }
    if (Number.isFinite(y)) pts.push({ x, y });
  }
  return pts;
}

// Root-finding: f(x) curve + per-iteration approximations converging to root.
export function buildRootGraph(funcStr: string, result: any, approxKey: string) {
  const steps: any[] = result.steps ?? [];
  const xs: number[] = [];
  for (const s of steps) {
    for (const k of X_KEYS) if (typeof s[k] === "number") xs.push(s[k]);
  }
  if (typeof result.root === "number") xs.push(result.root);
  if (xs.length === 0) return undefined;

  let lo = Math.min(...xs);
  let hi = Math.max(...xs);
  const pad = (hi - lo) * 0.2 || 1;
  lo -= pad;
  hi += pad;

  const approxPoints: Pt[] = steps
    .map((s) => s[approxKey])
    .filter((x) => typeof x === "number")
    .map((x: number) => ({ x, y: evaluateFunction(funcStr, x) }));

  return {
    type: "root" as const,
    curve: sampleCurve(funcStr, lo, hi),
    root: typeof result.root === "number" ? result.root : null,
    approxPoints,
    xLabel: "x",
    yLabel: "f(x)",
  };
}

// ODE: solution polyline through the computed (x, y) points.
export function buildOdeGraph(result: any) {
  const steps: any[] = result.steps ?? [];
  const points: Pt[] = steps
    .filter((s) => typeof s.x === "number" && typeof s.y === "number")
    .map((s) => ({ x: s.x, y: s.y }));
  if (
    typeof result.final_x === "number" &&
    typeof result.final_y === "number" &&
    (points.length === 0 || points[points.length - 1].x !== result.final_x)
  ) {
    points.push({ x: result.final_x, y: result.final_y });
  }
  if (points.length === 0) return undefined;
  return { type: "ode" as const, points, xLabel: "x", yLabel: "y" };
}

// Integration: f(x) curve + strip boundary points (shaded area under curve).
export function buildIntegrationGraph(funcStr: string, result: any) {
  const table: any[] = result.table ?? [];
  if (table.length < 2) return undefined;
  const a = table[0].x;
  const b = table[table.length - 1].x;
  return {
    type: "integration" as const,
    curve: sampleCurve(funcStr, a, b),
    points: table.map((t) => ({ x: t.x, y: t.y })),
    method: result.method,
    xLabel: "x",
    yLabel: "f(x)",
  };
}
