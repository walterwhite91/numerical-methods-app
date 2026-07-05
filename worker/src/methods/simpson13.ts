import { evaluateFunction } from "../lib/exprEval";

export function numericalIntegrationSimpson13(funcStr: string, a: number, b: number, n: number) {
  if (n % 2 !== 0) {
    return { success: false, message: "Simpson's 1/3 rule requires n to be even." };
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
  let sumOdd = 0;
  for (let i = 1; i < n; i += 2) sumOdd += table[i].y;
  let sumEven = 0;
  for (let i = 2; i < n; i += 2) sumEven += table[i].y;

  const integral = (h / 3) * (sumEdges + 4 * sumOdd + 2 * sumEven);

  const calculationSteps = [
    String.raw`\text{Formula: } I \approx \frac{h}{3} \left[ (y_0 + y_n) + 4 \sum_{\text{odd}} y_i + 2 \sum_{\text{even}} y_i \right]`,
    `I \\approx \\frac{${h.toFixed(4)}}{3} \\left[ (${y0.toFixed(4)} + ${yn.toFixed(4)}) + 4(${sumOdd.toFixed(4)}) + 2(${sumEven.toFixed(4)}) \\right]`,
    `I \\approx ${integral.toFixed(6)}`,
  ];

  return {
    success: true,
    h,
    table,
    calculation_steps: calculationSteps,
    integral,
    method: "simpson_13",
  };
}
