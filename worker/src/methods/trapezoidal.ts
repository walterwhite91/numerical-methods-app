import { evaluateFunction } from "../lib/exprEval";

export function numericalIntegrationTrapezoidal(funcStr: string, a: number, b: number, n: number) {
  const h = (b - a) / n;
  const table: { i: number; x: number; y: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const xI = a + i * h;
    const yI = evaluateFunction(funcStr, xI);
    table.push({ i, x: xI, y: yI });
  }

  const y0 = table[0].y;
  const yn = table[table.length - 1].y;

  const sumEdges = y0 + yn;
  const sumMiddle = table.slice(1, -1).reduce((s, t) => s + t.y, 0);
  const integral = (h / 2) * (sumEdges + 2 * sumMiddle);

  const calculationSteps = [
    String.raw`\text{Formula: } I \approx \frac{h}{2} \left[ (y_0 + y_n) + 2 \sum_{i=1}^{n-1} y_i \right]`,
    `I \\approx \\frac{${h.toFixed(4)}}{2} \\left[ (${y0.toFixed(4)} + ${yn.toFixed(4)}) + 2(${sumMiddle.toFixed(4)}) \\right]`,
    `I \\approx ${integral.toFixed(6)}`,
  ];

  return {
    success: true,
    h,
    table,
    calculation_steps: calculationSteps,
    integral,
    method: "trapezoidal",
  };
}
