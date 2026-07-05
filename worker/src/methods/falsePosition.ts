import { evaluateFunction } from "../lib/exprEval";

export interface FalsePositionStep {
  iteration: number;
  a: number;
  b: number;
  c: number;
  f_c: number;
  error: number;
}

export function falsePositionMethod(
  funcStr: string,
  a: number,
  b: number,
  tol = 1e-6,
  maxIter = 100
) {
  const steps: FalsePositionStep[] = [];

  let fa = evaluateFunction(funcStr, a);
  let fb = evaluateFunction(funcStr, b);

  if (fa * fb >= 0) {
    return {
      success: false,
      message: "Function must have opposite signs at a and b (f(a) * f(b) < 0).",
      root: null,
      steps,
    };
  }

  let xPrev = a;

  for (let i = 1; i <= maxIter; i++) {
    const c = (a * fb - b * fa) / (fb - fa);
    const fc = evaluateFunction(funcStr, c);

    const error = i > 1 ? Math.abs(c - xPrev) : Math.abs(b - a);

    steps.push({ iteration: i, a, b, c, f_c: fc, error });

    if (error < tol || fc === 0) {
      return {
        success: true,
        message: `Converged to root after ${i} iterations.`,
        root: c,
        steps,
      };
    }

    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }

    xPrev = c;
  }

  return {
    success: false,
    message: `Did not converge within ${maxIter} iterations.`,
    root: xPrev,
    steps,
  };
}
