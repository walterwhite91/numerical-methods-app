import { evaluateFunction } from "../lib/exprEval";

export function numericalIntegrationSimpson38(funcStr: string, a: number, b: number, n: number) {
  if (n % 3 !== 0) {
    return { success: false, message: "Simpson's 3/8 rule requires n to be a multiple of 3." };
  }

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
  let sumMult3 = 0;
  for (let i = 3; i < n; i += 3) sumMult3 += table[i].y;
  let sumRest = 0;
  for (let i = 1; i < n; i++) {
    if (i % 3 !== 0) sumRest += table[i].y;
  }

  const integral = ((3 * h) / 8) * (sumEdges + 3 * sumRest + 2 * sumMult3);

  const calculationSteps = [
    String.raw`\text{Formula: } I \approx \frac{3h}{8} \left[ (y_0 + y_n) + 3 \sum_{i \neq 3k} y_i + 2 \sum_{i=3, 6...} y_i \right]`,
    `I \\approx \\frac{3 \\cdot ${h.toFixed(4)}}{8} \\left[ (${y0.toFixed(4)} + ${yn.toFixed(4)}) + 3(${sumRest.toFixed(4)}) + 2(${sumMult3.toFixed(4)}) \\right]`,
    `I \\approx ${integral.toFixed(6)}`,
  ];

  return {
    success: true,
    h,
    table,
    calculation_steps: calculationSteps,
    integral,
    method: "simpson_38",
  };
}
