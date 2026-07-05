import { evaluateFunction } from "../lib/exprEval";

export interface BisectionStep {
  iteration: number;
  a: number;
  b: number;
  midpoint: number;
  f_mid: number;
  error: number;
}

export function bisectionMethod(
  funcStr: string,
  a: number,
  b: number,
  tol = 1e-6,
  maxIter = 100
) {
  const steps: BisectionStep[] = [];

  const fa0 = evaluateFunction(funcStr, a);
  const fb0 = evaluateFunction(funcStr, b);

  if (fa0 * fb0 >= 0) {
    return {
      success: false,
      message: "Function must have opposite signs at a and b (f(a) * f(b) < 0).",
      root: null,
      steps,
    };
  }

  let fa = fa0;
  let midpoint = (a + b) / 2.0;

  for (let i = 1; i <= maxIter; i++) {
    midpoint = (a + b) / 2.0;
    const fMid = evaluateFunction(funcStr, midpoint);
    const error = Math.abs(b - a) / 2.0;

    steps.push({ iteration: i, a, b, midpoint, f_mid: fMid, error });

    if (error < tol || fMid === 0) {
      return {
        success: true,
        message: `Converged to root after ${i} iterations.`,
        root: midpoint,
        steps,
      };
    }

    if (fa * fMid < 0) {
      b = midpoint;
    } else {
      a = midpoint;
      fa = fMid;
    }
  }

  return {
    success: false,
    message: `Did not converge within ${maxIter} iterations.`,
    root: midpoint,
    steps,
  };
}
