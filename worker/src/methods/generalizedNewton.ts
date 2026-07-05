import { evaluateFunction } from "../lib/exprEval";

export interface GeneralizedNewtonStep {
  iteration: number;
  x: number;
  f_x: number;
  df_x: number;
  x_new: number;
  error: number;
}

export function generalizedNewtonMethod(
  funcStr: string,
  derivStr: string,
  x0: number,
  multiplicity = 1,
  tol = 1e-6,
  maxIter = 100
) {
  const steps: GeneralizedNewtonStep[] = [];
  const m = Math.trunc(multiplicity);
  let x = x0;

  for (let i = 1; i <= maxIter; i++) {
    const fX = evaluateFunction(funcStr, x);
    const dfX = evaluateFunction(derivStr, x);

    if (dfX === 0) {
      return {
        success: false,
        message: "Derivative is zero. Cannot continue.",
        root: null,
        steps,
      };
    }

    const xNew = x - (m * fX) / dfX;
    const error = Math.abs(xNew - x);

    steps.push({ iteration: i, x, f_x: fX, df_x: dfX, x_new: xNew, error });

    if (error < tol) {
      return {
        success: true,
        message: `Converged to root after ${i} iterations.`,
        root: xNew,
        steps,
      };
    }

    x = xNew;
  }

  return {
    success: false,
    message: `Did not converge within ${maxIter} iterations.`,
    root: x,
    steps,
  };
}
