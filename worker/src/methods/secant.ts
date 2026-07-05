import { evaluateFunction } from "../lib/exprEval";

export interface SecantStep {
  iteration: number;
  x_prev: number;
  x_curr: number;
  x_new: number;
  f_curr: number;
  error: number;
}

export function secantMethod(funcStr: string, x0: number, x1: number, tol = 1e-6, maxIter = 100) {
  const steps: SecantStep[] = [];

  for (let i = 1; i <= maxIter; i++) {
    const f0 = evaluateFunction(funcStr, x0);
    const f1 = evaluateFunction(funcStr, x1);

    if (f1 - f0 === 0) {
      return {
        success: false,
        message: "Denominator is zero (f1 = f0).",
        root: null,
        steps,
      };
    }

    const x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);
    const error = Math.abs(x2 - x1);

    steps.push({ iteration: i, x_prev: x0, x_curr: x1, x_new: x2, f_curr: f1, error });

    if (error < tol) {
      return {
        success: true,
        message: `Converged to root after ${i} iterations.`,
        root: x2,
        steps,
      };
    }

    x0 = x1;
    x1 = x2;
  }

  return {
    success: false,
    message: `Did not converge within ${maxIter} iterations.`,
    root: x1,
    steps,
  };
}
