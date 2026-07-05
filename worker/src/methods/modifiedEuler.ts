import { evaluateSystem } from "../lib/exprEval";

export interface ModifiedEulerStep {
  iteration: number;
  x: number;
  y: number;
  f_xy: number;
  y_predict: number;
  f_xnext_ypredict: number;
  y_correct: number;
}

export function modifiedEulerMethod(funcStr: string, x0: number, y0: number, h: number, stepsCount: number) {
  const steps: ModifiedEulerStep[] = [];
  let x = x0;
  let y = y0;

  for (let i = 0; i < stepsCount; i++) {
    let fXy: number, yPredict: number, xNext: number, fXnextYpredict: number, yCorrect: number;
    try {
      fXy = evaluateSystem([funcStr], { x, y })[0];
      yPredict = y + h * fXy;
      xNext = x + h;
      fXnextYpredict = evaluateSystem([funcStr], { x: xNext, y: yPredict })[0];
      yCorrect = y + (h / 2) * (fXy + fXnextYpredict);
    } catch (e) {
      return { success: false, message: (e as Error).message, steps };
    }

    steps.push({
      iteration: i,
      x,
      y,
      f_xy: fXy,
      y_predict: yPredict,
      f_xnext_ypredict: fXnextYpredict,
      y_correct: yCorrect,
    });

    y = yCorrect;
    x = xNext;
  }

  return { success: true, steps, final_x: x, final_y: y };
}
