import { evaluateSystem } from "../lib/exprEval";

export interface EulerStep {
  iteration: number;
  x: number;
  y: number;
  slope: number;
  dy: number;
}

export function eulerMethod(funcStr: string, x0: number, y0: number, h: number, stepsCount: number) {
  const steps: EulerStep[] = [];
  let x = x0;
  let y = y0;

  for (let i = 0; i <= stepsCount; i++) {
    let fXy: number;
    try {
      fXy = evaluateSystem([funcStr], { x, y })[0];
    } catch (e) {
      return { success: false, message: (e as Error).message, steps };
    }

    steps.push({ iteration: i, x, y, slope: fXy, dy: h * fXy });

    y = y + h * fXy;
    x = x + h;
  }

  return {
    success: true,
    steps,
    final_x: x - h,
    final_y: y - h * steps[steps.length - 1].slope,
  };
}
