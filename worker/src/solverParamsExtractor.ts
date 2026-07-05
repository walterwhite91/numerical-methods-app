// Port of backend/methods/solver_params_extractor.py
// Heuristic extraction of numerical solver inputs from natural-language exam questions.

type Params = Record<string, unknown>;

function stripChars(s: string, chars: string): string {
  let start = 0;
  let end = s.length;
  while (start < end && chars.includes(s[start])) start++;
  while (end > start && chars.includes(s[end - 1])) end--;
  return s.slice(start, end);
}

function findNumbers(text: string): number[] {
  const matches = text.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g);
  return matches ? matches.map(Number) : [];
}

function stripLatex(text: string): string {
  text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)");
  text = text.replace(/\\[a-zA-Z]+\*?/g, " ");
  text = text.replace(/[{}]/g, " ");
  return text;
}

function latexFuncToPython(expr: string): string {
  expr = expr.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)");
  expr = expr.replace(/\\sqrt\{([^}]+)\}/g, "($1)**0.5");
  expr = expr.replace(/\\left|\\right|\\,|\\;|\\!/g, "");
  expr = expr.replace(/\^([0-9]+)/g, "**$1");
  expr = expr.replace(/\^(\{[^}]+\})/g, (_m, g1: string) => `**(${g1.slice(1, -1)})`);
  expr = expr.replace(/\\ln/g, "log");
  expr = expr.replace(/\\log/g, "log10");
  expr = expr.replace(/\\sin/g, "sin");
  expr = expr.replace(/\\cos/g, "cos");
  expr = expr.replace(/\\tan/g, "tan");
  expr = expr.replace(/\\exp/g, "exp");
  expr = expr.replace(/\\e\b/g, "exp(1)");
  expr = expr.replace(/[{}]/g, "");
  expr = expr.replace(/\s+/g, "");
  return expr.trim();
}

function extractFuncFromEquation(question: string): string | null {
  const patterns: RegExp[] = [
    /\$f\(x\)\s*=\s*([^$]+?)\$/i,
    /f\(x\)\s*=\s*([^$,.\n]+)/i,
    /equation\s+([^$]+?)\s*=\s*0/i,
    /\$([^$]+?)\s*=\s*0\$/i,
    /root of (?:the equation\s*)?(?:\$)?(.+?)\s*=\s*0/i,
    /solve\s+(?:\$)?(.+?)\s*=\s*0/i,
  ];

  for (const pat of patterns) {
    const m = question.match(pat);
    if (m) {
      const raw = stripChars(m[1].trim(), "$");
      if (raw === "0" || raw.toLowerCase() === "y" || raw.toLowerCase() === "f(x)") continue;
      const py = latexFuncToPython(raw);
      if (py && py.length >= 1 && !/\bis\b|\bthe\b|\bof\b/.test(py.toLowerCase())) {
        return py;
      }
    }
  }
  return null;
}

function extractOdeFunc(question: string): string | null {
  const patterns: RegExp[] = [
    /\\frac\{dy\}\{dx\}\s*=\s*(.+?)(?:\s*,|\s*\$|\s*with|\s*and|\s*$)/i,
    /y'\s*=\s*(.+?)(?:\s*,|\s*\$|\s*with|\s*\.|\s*$)/i,
    /y'\s*=\s*\$(.+?)\$/i,
  ];

  for (const pat of patterns) {
    const m = question.match(pat);
    if (m) {
      const raw = stripChars(stripChars(m[1].trim(), "$").trim(), ",").trim();
      const py = latexFuncToPython(raw);
      if (py) return py;
    }
  }
  return null;
}

function extractIntegralFunc(question: string): string | null {
  let m = question.match(/\\int[_^{}\d\w]+\s+(.+?)\s*(?:\\,\s*)?d[xyzt]/);
  if (m) {
    const raw = stripChars(m[1].trim(), "$");
    return latexFuncToPython(raw);
  }

  m = question.match(/integral of (.+?) (?:from|over|between)/i);
  if (m) return latexFuncToPython(m[1]);

  return null;
}

function extractBounds(question: string): [number | null, number | null] {
  const stripped = stripLatex(question);

  let m = stripped.match(/(?:in|interval|between)\s*[\[(](-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)[\])]/i);
  if (m) return [parseFloat(m[1]), parseFloat(m[2])];

  m = stripped.match(/approximations?\s+(-?\d+\.?\d*)\s+and\s+(-?\d+\.?\d*)/i);
  if (m) return [parseFloat(m[1]), parseFloat(m[2])];

  m = question.match(/\\int_\{?(-?\d+\.?\d*)\}?\^\{?(-?\d+\.?\d*)\}?/);
  if (m) return [parseFloat(m[1]), parseFloat(m[2])];

  m = stripped.match(/from\s+(-?\d+\.?\d*)\s+to\s+(-?\d+\.?\d*)/i);
  if (m) return [parseFloat(m[1]), parseFloat(m[2])];

  return [null, null];
}

function extractX0Y0(question: string): [number | null, number | null] {
  const stripped = stripLatex(question);

  let m = stripped.match(/y\s*\((-?\d+\.?\d*)\)\s*=\s*(-?\d+\.?\d*)/);
  if (m) return [parseFloat(m[1]), parseFloat(m[2])];

  m = stripped.match(/x[_0]*\s*=\s*(-?\d+\.?\d*)/i);
  const x0 = m ? parseFloat(m[1]) : null;

  const m2 = stripped.match(/y[_0]*\s*=\s*(-?\d+\.?\d*)/i);
  const y0 = m2 ? parseFloat(m2[1]) : null;

  return [x0, y0];
}

function extractStepSize(question: string): number | null {
  const stripped = stripLatex(question);
  const m = stripped.match(/(?:step\s*size|h)\s*=\s*(-?\d+\.?\d*(?:\/\d+)?)/i);
  if (m) {
    const val = m[1];
    if (val.includes("/")) {
      const [num, den] = val.split("/");
      return parseFloat(num) / parseFloat(den);
    }
    return parseFloat(val);
  }
  return null;
}

function extractN(question: string): number | null {
  const stripped = stripLatex(question);
  const m = stripped.match(/n\s*=\s*(\d+)/i);
  if (m) return parseInt(m[1], 10);
  return null;
}

// ---------------------------------------------------------------------------
// Per-method extractors
// ---------------------------------------------------------------------------

function paramsBisection(question: string): Params {
  const func = extractFuncFromEquation(question);
  const [a, b] = extractBounds(question);
  return {
    method: "bisection",
    func_str: func ?? "x**3 - x - 1",
    a: a ?? 1.0,
    b: b ?? 2.0,
    tol: 1e-4,
    max_iter: 50,
  };
}

function paramsNewtonRaphson(question: string): Params {
  const func = extractFuncFromEquation(question);
  let [x0] = extractX0Y0(question);
  if (x0 === null) {
    const stripped = stripLatex(question);
    const m = stripped.match(/x_?0\s*=\s*(-?\d+\.?\d*)/i);
    if (m) x0 = parseFloat(m[1]);
  }
  return {
    method: "newton-raphson",
    func_str: func ?? "x**3 - x - 1",
    deriv_str: "",
    x0: x0 ?? 1.5,
    tol: 1e-6,
    max_iter: 50,
  };
}

function paramsSecant(question: string): Params {
  const func = extractFuncFromEquation(question);
  const stripped = stripLatex(question);
  const nums = findNumbers(stripped);
  const [x0, x1] = nums.length >= 2 ? [nums[0], nums[1]] : [1.0, 2.0];
  return {
    method: "secant",
    func_str: func ?? "x**3 - x - 1",
    x0,
    x1,
    tol: 1e-6,
    max_iter: 50,
  };
}

function paramsFalsePosition(question: string): Params {
  const func = extractFuncFromEquation(question);
  const [a, b] = extractBounds(question);
  return {
    method: "false-position",
    func_str: func ?? "x**3 - x - 1",
    a: a ?? 1.0,
    b: b ?? 2.0,
    tol: 1e-4,
    max_iter: 50,
  };
}

function paramsEuler(question: string): Params {
  const func = extractOdeFunc(question);
  const [x0, y0] = extractX0Y0(question);
  const h = extractStepSize(question);
  return {
    method: "euler",
    func_str: func ?? "x + y",
    x0: x0 ?? 0.0,
    y0: y0 ?? 1.0,
    h: h ?? 0.1,
    steps_count: 5,
  };
}

function paramsModifiedEuler(question: string): Params {
  const p = paramsEuler(question);
  p.method = "modified-euler";
  return p;
}

function paramsRk4(question: string): Params {
  const func = extractOdeFunc(question);
  const [x0, y0] = extractX0Y0(question);
  const h = extractStepSize(question);
  return {
    method: "rk4",
    func_str: func ?? "x + y",
    x0: x0 ?? 0.0,
    y0: y0 ?? 1.0,
    h: h ?? 0.1,
    steps_count: 5,
  };
}

function paramsTrapezoidal(question: string): Params {
  const func = extractIntegralFunc(question);
  const [a, b] = extractBounds(question);
  const h = extractStepSize(question);
  let n = extractN(question);
  if (n === null && h && a !== null && b !== null) {
    n = Math.max(1, Math.round((b - a) / h));
  }
  return {
    method: "trapezoidal",
    func_str: func ?? "1/(1+x)",
    a: a ?? 0.0,
    b: b ?? 1.0,
    n: n ?? 4,
  };
}

function paramsSimpson13(question: string): Params {
  const p = paramsTrapezoidal(question);
  p.method = "simpson-13";
  return p;
}

function paramsSimpson38(question: string): Params {
  const p = paramsTrapezoidal(question);
  p.method = "simpson-38";
  const n = p.n as number;
  if (n && n % 3 !== 0) {
    p.n = Math.max(3, Math.floor(n / 3) * 3);
  }
  return p;
}

function paramsForwardDifference(_question: string): Params {
  return { method: "forward-difference" };
}

// ---------------------------------------------------------------------------
// Dispatch table
// ---------------------------------------------------------------------------

const EXTRACTORS: Record<string, (question: string) => Params> = {
  bisection: paramsBisection,
  "false-position": paramsFalsePosition,
  "newton-raphson": paramsNewtonRaphson,
  secant: paramsSecant,
  euler: paramsEuler,
  "modified-euler": paramsModifiedEuler,
  rk4: paramsRk4,
  trapezoidal: paramsTrapezoidal,
  "simpson-13": paramsSimpson13,
  "simpson-38": paramsSimpson38,
  "forward-difference": paramsForwardDifference,
  "lu-decomposition": () => ({ method: "lu-decomposition" }),
  "gauss-seidel": () => ({ method: "gauss-seidel" }),
  "gauss-jacobi": () => ({ method: "gauss-jacobi" }),
  "thomas-algorithm": () => ({ method: "thomas-algorithm" }),
};

export function extractSolverParams(questionText: string, solverMethod: string): Params {
  const extractor = EXTRACTORS[solverMethod];
  if (!extractor) return {};
  try {
    return extractor(questionText);
  } catch {
    return { method: solverMethod };
  }
}
