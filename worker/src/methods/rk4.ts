import { evaluateSystem } from "../lib/exprEval";

export interface Rk4Step {
  iteration: number;
  x: number;
  y: number;
  k1: number;
  k2: number;
  k3: number;
  k4: number;
  y_next: number;
}

export function rungeKutta4(funcStr: string, x0: number, y0: number, h: number, stepsCount: number) {
  const steps: Rk4Step[] = [];
  let x = x0;
  let y = y0;

  for (let i = 0; i < stepsCount; i++) {
    let k1: number, k2: number, k3: number, k4: number;
    try {
      k1 = h * evaluateSystem([funcStr], { x, y })[0];
      k2 = h * evaluateSystem([funcStr], { x: x + h / 2, y: y + k1 / 2 })[0];
      k3 = h * evaluateSystem([funcStr], { x: x + h / 2, y: y + k2 / 2 })[0];
      k4 = h * evaluateSystem([funcStr], { x: x + h, y: y + k3 })[0];
    } catch (e) {
      return { success: false, message: (e as Error).message, steps };
    }

    const yNext = y + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    const xNext = x + h;

    steps.push({ iteration: i, x, y, k1, k2, k3, k4, y_next: yNext });

    y = yNext;
    x = xNext;
  }

  return { success: true, steps, final_x: x, final_y: y };
}
