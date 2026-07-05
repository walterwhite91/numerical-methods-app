// Safe math expression evaluator: recursive-descent parser, no eval/new Function
// (Cloudflare Workers block dynamic code generation). Mirrors Python's
// restricted-namespace eval() used in backend/methods/utils.py.

type Scope = Record<string, number>;

const CONSTANTS: Scope = {
  pi: Math.PI,
  e: Math.E,
};

const FUNCTIONS: Record<string, (...args: number[]) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  atan2: Math.atan2,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  exp: Math.exp,
  log: (x, base) => (base === undefined ? Math.log(x) : Math.log(x) / Math.log(base)),
  log10: Math.log10,
  log2: Math.log2,
  sqrt: Math.sqrt,
  abs: Math.abs,
  pow: Math.pow,
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
};

type TokenType = "num" | "ident" | "op" | "lparen" | "rparen" | "comma" | "end";

interface Token {
  type: TokenType;
  value: string;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = input.length;

  while (i < n) {
    const c = input[i];

    if (c === " " || c === "\t" || c === "\n") {
      i++;
      continue;
    }

    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < n && /[0-9.]/.test(input[j])) j++;
      // scientific notation, e.g. 1e-6
      if (j < n && (input[j] === "e" || input[j] === "E")) {
        let k = j + 1;
        if (k < n && (input[k] === "+" || input[k] === "-")) k++;
        if (k < n && /[0-9]/.test(input[k])) {
          j = k;
          while (j < n && /[0-9]/.test(input[j])) j++;
        }
      }
      tokens.push({ type: "num", value: input.slice(i, j) });
      i = j;
      continue;
    }

    if (/[a-zA-Z_]/.test(c)) {
      let j = i;
      while (j < n && /[a-zA-Z0-9_]/.test(input[j])) j++;
      tokens.push({ type: "ident", value: input.slice(i, j) });
      i = j;
      continue;
    }

    if (c === "*" && input[i + 1] === "*") {
      tokens.push({ type: "op", value: "^" });
      i += 2;
      continue;
    }

    if ("+-*/^%".includes(c)) {
      tokens.push({ type: "op", value: c });
      i++;
      continue;
    }

    if (c === "(") {
      tokens.push({ type: "lparen", value: c });
      i++;
      continue;
    }

    if (c === ")") {
      tokens.push({ type: "rparen", value: c });
      i++;
      continue;
    }

    if (c === ",") {
      tokens.push({ type: "comma", value: c });
      i++;
      continue;
    }

    throw new Error(`Unexpected character '${c}' in expression '${input}'`);
  }

  tokens.push({ type: "end", value: "" });
  return tokens;
}

// Recursive-descent parser with standard precedence:
// addition/subtraction < multiplication/division < unary +/- < exponentiation (right-assoc)
class Parser {
  private tokens: Token[];
  private pos = 0;
  private scope: Scope;

  constructor(tokens: Token[], scope: Scope) {
    this.tokens = tokens;
    this.scope = scope;
  }

  private peek(): Token {
    return this.tokens[this.pos];
  }

  private next(): Token {
    return this.tokens[this.pos++];
  }

  parse(): number {
    const value = this.parseExpression();
    if (this.peek().type !== "end") {
      throw new Error(`Unexpected token '${this.peek().value}'`);
    }
    return value;
  }

  private parseExpression(): number {
    let value = this.parseTerm();
    while (this.peek().type === "op" && (this.peek().value === "+" || this.peek().value === "-")) {
      const op = this.next().value;
      const rhs = this.parseTerm();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }

  private parseTerm(): number {
    let value = this.parseUnary();
    while (
      this.peek().type === "op" &&
      (this.peek().value === "*" || this.peek().value === "/" || this.peek().value === "%")
    ) {
      const op = this.next().value;
      const rhs = this.parseUnary();
      if (op === "*") value *= rhs;
      else if (op === "/") value /= rhs;
      else value %= rhs;
    }
    return value;
  }

  private parseUnary(): number {
    if (this.peek().type === "op" && (this.peek().value === "+" || this.peek().value === "-")) {
      const op = this.next().value;
      const value = this.parseUnary();
      return op === "-" ? -value : value;
    }
    return this.parsePower();
  }

  private parsePower(): number {
    const base = this.parseAtom();
    if (this.peek().type === "op" && this.peek().value === "^") {
      this.next();
      const exponent = this.parseUnary(); // right-associative, allows x^-1
      return Math.pow(base, exponent);
    }
    return base;
  }

  private parseAtom(): number {
    const tok = this.peek();

    if (tok.type === "num") {
      this.next();
      return parseFloat(tok.value);
    }

    if (tok.type === "lparen") {
      this.next();
      const value = this.parseExpression();
      if (this.peek().type !== "rparen") throw new Error("Expected ')'");
      this.next();
      return value;
    }

    if (tok.type === "ident") {
      this.next();
      const name = tok.value;

      // function call
      if (this.peek().type === "lparen") {
        this.next();
        const args: number[] = [];
        if (this.peek().type !== "rparen") {
          args.push(this.parseExpression());
          while (this.peek().type === "comma") {
            this.next();
            args.push(this.parseExpression());
          }
        }
        if (this.peek().type !== "rparen") throw new Error("Expected ')'");
        this.next();

        const fn = FUNCTIONS[name];
        if (!fn) throw new Error(`Unknown function '${name}'`);
        return fn(...args);
      }

      if (name in this.scope) return this.scope[name];
      if (name in CONSTANTS) return CONSTANTS[name];
      throw new Error(`Unknown identifier '${name}'`);
    }

    throw new Error(`Unexpected token '${tok.value}'`);
  }
}

function evaluateExpr(exprStr: string, scope: Scope): number {
  const tokens = tokenize(exprStr);
  const parser = new Parser(tokens, scope);
  const result = parser.parse();
  if (typeof result !== "number" || Number.isNaN(result)) {
    throw new Error(`Expression '${exprStr}' did not evaluate to a number`);
  }
  return result;
}

/** Port of methods/utils.py::evaluate_function */
export function evaluateFunction(funcStr: string, xVal: number): number {
  try {
    return evaluateExpr(funcStr, { x: xVal });
  } catch (e) {
    throw new Error(`Error evaluating function '${funcStr}' with x=${xVal}: ${(e as Error).message}`);
  }
}

/** Port of methods/utils.py::evaluate_system */
export function evaluateSystem(funcStrs: string[], varsDict: Scope): number[] {
  const results: number[] = [];
  for (const funcStr of funcStrs) {
    try {
      results.push(evaluateExpr(funcStr, varsDict));
    } catch (e) {
      throw new Error(
        `Error evaluating function '${funcStr}' with vars ${JSON.stringify(varsDict)}: ${(e as Error).message}`
      );
    }
  }
  return results;
}

/** Port of methods/utils.py::solve_linear_system (Gaussian elimination, partial pivoting) */
export function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(M[r][i]) > Math.abs(M[maxRow][i])) maxRow = r;
    }
    [M[i], M[maxRow]] = [M[maxRow], M[i]];

    if (M[i][i] === 0) throw new Error("Matrix is singular.");

    for (let j = i + 1; j < n; j++) {
      const factor = M[j][i] / M[i][i];
      for (let k = i; k <= n; k++) {
        M[j][k] -= factor * M[i][k];
      }
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = 0;
    for (let j = i + 1; j < n; j++) s += M[i][j] * x[j];
    x[i] = (M[i][n] - s) / M[i][i];
  }
  return x;
}
