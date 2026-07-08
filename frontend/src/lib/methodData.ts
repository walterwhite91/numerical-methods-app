export interface MethodInfo {
  id: string;
  name: string;
  category: string;
  definition: string;
  formula: string;
  algorithm: string[];
  conditions: string[];
  useCases: string[];
  example: {
    problem: string;
    solution: string;
  };
  // Prompt/value pairs matching the script's input() prompts, in order,
  // for methods that have a runnable Python implementation in /scripts.
  exampleInput?: string[];
}

export const categories = [
  { id: "error-detection", name: "Detection of Error" },
  { id: "root-finding", name: "Roots of Equations" },
  { id: "linear-systems", name: "Matrix Operations" },
  { id: "finite-differences", name: "Interpolation" },
  { id: "numerical-differentiation", name: "Numerical Differentiation" },
  { id: "ode", name: "Ordinary Differential Equations (IVP)" },
  { id: "bvp", name: "Boundary Value Problems (Finite Difference Method)" },
  { id: "integration", name: "Numerical Integration" },
  { id: "nonlinear-systems", name: "System of Nonlinear Equations" },
  { id: "curve-fitting", name: "Curve Fitting" }
];

export const methodsData: Record<string, MethodInfo> = {
  // Detection of Error
  "absolute-relative-error": {
    id: "absolute-relative-error",
    name: "Absolute & Relative Error",
    category: "error-detection",
    definition: "Fundamental measures to quantify how far an approximate computed value is from the true exact value.",
    formula: "E_A = X - X_1, \\quad E_R = \\frac{E_A}{X}",
    algorithm: [
      "Identify the true exact value $X$.",
      "Identify the approximate computed value $X_1$.",
      "Calculate Absolute Error $E_A = X - X_1$.",
      "Calculate Relative Error $E_R = \\frac{E_A}{X}$."
    ],
    conditions: [
      "True value $X$ must be non-zero to calculate Relative Error."
    ],
    useCases: [
      "Evaluating the accuracy of a numerical approximation.",
      "Determining convergence criteria in iterative numerical methods."
    ],
    example: {
      problem: "Find absolute and relative error if true value $X = 3.141592$ is approximated by $X_1 = 3.14$.",
      solution: "$E_A = 0.001592$, $E_R = 0.0005067$."
    },
    exampleInput: [
      "True value X: 3.141592",
      "Approximate value X1: 3.14"
    ]
  },
  "general-error-formula": {
    id: "general-error-formula",
    name: "General Error Formula (Error Propagation)",
    category: "error-detection",
    definition: "Estimates how errors in several independent variables propagate through a function, using a first-order Taylor series expansion.",
    formula: "\\Delta u = \\Delta n_1 \\frac{\\partial f}{\\partial n_1} + \\Delta n_2 \\frac{\\partial f}{\\partial n_2} + \\cdots + \\Delta n_n \\frac{\\partial f}{\\partial n_n}",
    algorithm: [
      "Identify function $u = f(n_1, n_2, n_3, \\dots, n_n)$.",
      "Compute partial derivatives $\\frac{\\partial f}{\\partial n_i}$ for each variable.",
      "Multiply each partial derivative by its variable's error $\\Delta n_i$.",
      "Sum the terms to get $\\Delta u$, or take absolute values of each term and sum for the maximum error bound $(\\Delta u)_{max}$."
    ],
    conditions: [
      "Function $f$ must be differentiable with respect to each $n_i$.",
      "Errors $\\Delta n_i$ assumed small enough for a first-order Taylor approximation to hold."
    ],
    useCases: [
      "Propagating measurement error through a multivariable formula.",
      "Bounding worst-case error in a computed quantity that depends on several approximate inputs."
    ],
    example: {
      problem: "For $u = f(n_1, n_2, n_3)$, bound the maximum error given individual errors $\\Delta n_1, \\Delta n_2, \\Delta n_3$.",
      solution: "$(\\Delta u)_{max} \\leq \\left|\\Delta n_1 \\frac{\\partial f}{\\partial n_1}\\right| + \\left|\\Delta n_2 \\frac{\\partial f}{\\partial n_2}\\right| + \\left|\\Delta n_3 \\frac{\\partial f}{\\partial n_3}\\right|$."
    },
    exampleInput: [
      "u(n1,n2,n3): (n1 * n2) / n3",
      "n1, n2, n3: 10 4 2",
      "delta_n1, delta_n2, delta_n3: 0.1 0.05 0.02"
    ]
  },
  "division-error": {
    id: "division-error",
    name: "Division Error Formula",
    category: "error-detection",
    definition: "Derives the relative error of a quotient $a/b$, where $a$ and $b$ each carry their own absolute error.",
    formula: "\\epsilon_R = \\frac{\\epsilon_A}{a/b} = \\frac{|\\epsilon_A^1|}{a} + \\frac{|\\epsilon_A^2|}{b}",
    algorithm: [
      "Identify $a$ and $b$ and their absolute errors $\\epsilon_A^1$ (error in $a$) and $\\epsilon_A^2$ (error in $b$).",
      "Form the quotient $a/b$ using Taylor expansion: $\\frac{E_A}{a} = \\frac{b \\cdot \\epsilon_A^1 - a \\cdot \\epsilon_A^2}{b^2}$.",
      "Simplify to the relative error form: $\\epsilon_R = \\frac{|\\epsilon_A^1|}{a} + \\frac{|\\epsilon_A^2|}{b}$."
    ],
    conditions: [
      "$a \\neq 0$ and $b \\neq 0$."
    ],
    useCases: [
      "Bounding the error of a division when both numerator and denominator are approximate values."
    ],
    example: {
      problem: "Given $a$, $b$ with absolute errors $\\epsilon_A^1$, $\\epsilon_A^2$, find the relative error of $a/b$.",
      solution: "$\\epsilon_R = \\frac{|\\epsilon_A^1|}{a} + \\frac{|\\epsilon_A^2|}{b}$."
    }
  },
  "product-quotient-error-rule": {
    id: "product-quotient-error-rule",
    name: "Product / Quotient Error Rule",
    category: "error-detection",
    definition: "A shortcut form of the General Error Formula for the common cases of a product $uv$ or a quotient $x/y$: relative errors simply add.",
    formula: "\\frac{\\Delta(uv)}{uv} = \\frac{\\Delta u}{u} + \\frac{\\Delta v}{v}, \\quad \\frac{\\Delta(x/y)}{x/y} = \\frac{\\Delta x}{x} + \\frac{\\Delta y}{y}",
    algorithm: [
      "Identify whether the quantity is a product $uv$ or a quotient $x/y$.",
      "Compute the relative error of each factor: $\\Delta u / u$, $\\Delta v / v$ (or $\\Delta x / x$, $\\Delta y / y$).",
      "Add the relative errors to get the relative error of the product or quotient."
    ],
    conditions: [
      "All variables non-zero.",
      "Errors assumed small enough for a first-order approximation."
    ],
    useCases: [
      "Quick relative-error estimate for products and quotients without redoing the full Taylor expansion."
    ],
    example: {
      problem: "If $u$ has relative error 1% and $v$ has relative error 2%, what is the relative error of $uv$?",
      solution: "$\\frac{\\Delta(uv)}{uv} = 1\\% + 2\\% = 3\\%$."
    }
  },
  "product-of-n-numbers-error": {
    id: "product-of-n-numbers-error",
    name: "Error of Product of n Numbers",
    category: "error-detection",
    definition: "Expands the absolute error of a product of several approximate numbers $a, b, c, \\dots$, each carrying its own small error.",
    formula: "\\epsilon_A = (a + \\epsilon_A^1)(b + \\epsilon_A^2)(c + \\epsilon_A^3) - abc",
    algorithm: [
      "Write each factor as its true value plus its absolute error: $(a + \\epsilon_A^1)$, $(b + \\epsilon_A^2)$, $(c + \\epsilon_A^3)$.",
      "Multiply out the product and subtract the exact product $abc$.",
      "Keep the first-order terms ($\\epsilon_A^1 bc + a\\epsilon_A^2 c + ab\\epsilon_A^3$, etc.) as the dominant part of the error; higher-order cross terms (products of two or more $\\epsilon$'s) are usually negligible."
    ],
    conditions: [
      "Errors $\\epsilon_A^1, \\epsilon_A^2, \\epsilon_A^3$ assumed small relative to $a, b, c$."
    ],
    useCases: [
      "Full expansion of error propagation through a product of three or more approximate numbers, before dropping to the simplified Product/Quotient Error Rule."
    ],
    example: {
      problem: "Expand $\\epsilon_A$ for the product of three approximate numbers $a$, $b$, $c$.",
      solution: "$\\epsilon_A = \\epsilon_A^1 bc + a\\epsilon_A^2 c + ab\\epsilon_A^3 + \\text{(higher-order cross terms)}$."
    }
  },
  "summation-error-propagation": {
    id: "summation-error-propagation",
    name: "Error Propagation in Summation",
    category: "error-detection",
    definition: "A procedure (rather than a single formula) for bounding the total absolute error when summing several numbers with mismatched precision or differing absolute errors.",
    formula: "\\text{Total } E_A = \\sum \\text{(individual absolute errors)} + \\text{(rounding error)}",
    algorithm: [
      "Identify which numbers in the sum carry the greatest absolute error.",
      "Round all other numbers to the same number of decimal places as the least precise number.",
      "Sum all the (now consistently rounded) numbers.",
      "Total absolute error = sum of the individual absolute errors, plus the extra rounding error introduced by step 2."
    ],
    conditions: [
      "Applies when summing numbers with different levels of precision or different known absolute errors."
    ],
    useCases: [
      "Determining how many decimal places a final summed result can be trusted to."
    ],
    example: {
      problem: "Two numbers in a sum have absolute error 0.05 each; round the other 7 numbers to two decimal places (rounding error 0.005 each), then add a final rounding error of 0.01.",
      solution: "Total absolute error $= 2(0.05) + 7(0.005) + 0.01 = 0.15$, giving $S = 472.95 \\pm 0.15$."
    }
  },

  // Root Finding
  "bisection": {
    id: "bisection",
    name: "Bisection Method",
    category: "root-finding",
    definition: "An incremental bracketing method that repeatedly bisects an interval and selects a subinterval in which a root must lie for a continuous function. It converges linearly.",
    formula: "c = \\frac{a + b}{2}",
    algorithm: [
      "Choose $a$ and $b$ such that $f(a)$ and $f(b)$ have opposite signs ($f(a) \\cdot f(b) < 0$).",
      "Calculate the midpoint $c = \\frac{a + b}{2}$.",
      "Evaluate $f(c)$.",
      "If $f(c) \\approx 0$ or interval length $|b - a|$ is below tolerance, stop.",
      "If $f(a) \\cdot f(c) < 0$, set $b = c$. Else, set $a = c$.",
      "Repeat steps 2-5."
    ],
    conditions: [
      "$f(x)$ must be continuous in the interval $[a, b]$.",
      "$f(a) \\cdot f(b) < 0$ (Intermediate Value Theorem).",
      "Iterations needed for $N$ decimal places: $n \\geq \\ln\\left(\\frac{b-a}{5 \\times 10^{-N}}\\right)$."
    ],
    useCases: [
      "Finding single real roots of continuous functions.",
      "Initializing bounds for faster methods like Newton-Raphson."
    ],
    example: {
      problem: "Find a root of $f(x) = x^3 - x - 1$ in $[1, 2]$ with tolerance $10^{-4}$.",
      solution: "The root converges to approximately $1.3247$ after 14 iterations."
    },
    exampleInput: [
      "f(x): x**3 - x - 1",
      "a: 1",
      "b: 2",
      "tolerance: 1e-4"
    ]
  },
  "secant": {
    id: "secant",
    name: "Secant Method",
    category: "root-finding",
    definition: "An iterative open method that approximates the derivative using secant lines. It has a super-linear convergence rate.",
    formula: "x_{n+1} = x_n - f(x_n) \\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}",
    algorithm: [
      "Choose two initial guesses $x_0$ and $x_1$.",
      "Compute $x_{n+1}$ using the secant formula.",
      "Check error $|x_{n+1} - x_n|$.",
      "If error $<$ tolerance, stop and return the root.",
      "Otherwise, set $x_{n-1} = x_n$ and $x_n = x_{n+1}$.",
      "Repeat."
    ],
    conditions: [
      "$f(x_n) \\neq f(x_{n-1})$ to avoid division by zero.",
      "No guaranteed convergence if initial guesses are far from the root."
    ],
    useCases: [
      "Faster than bisection method.",
      "Useful when computing derivatives analytically is difficult or impossible."
    ],
    example: {
      problem: "Solve $x^3 - x - 1 = 0$ starting with $x_0 = 1$, $x_1 = 2$.",
      solution: "Root converges to $1.3247$."
    },
    exampleInput: [
      "f(x): x**3 - x - 1",
      "x0: 1",
      "x1: 2",
      "tolerance: 1e-6"
    ]
  },
  "false-position": {
    id: "false-position",
    name: "False Position (Regula Falsi)",
    category: "root-finding",
    definition: "A closed-interval bracketing method that connects $f(a)$ and $f(b)$ with a straight chord and finds its x-intercept to estimate the root. Often faster than bisection.",
    formula: "c = \\frac{a f(b) - b f(a)}{f(b) - f(a)}",
    algorithm: [
      "Choose $a$ and $b$ such that $f(a) \\cdot f(b) < 0$.",
      "Calculate the false position root estimate $c$.",
      "Evaluate $f(c)$.",
      "If $f(a) \\cdot f(c) < 0$, set $b = c$. Else, set $a = c$.",
      "Repeat until convergence."
    ],
    conditions: [
      "$f(x)$ must be continuous in $[a, b]$.",
      "$f(a) \\cdot f(b) < 0$."
    ],
    useCases: [
      "Guaranteed convergence (unlike Secant).",
      "Usually faster than Bisection for smooth functions."
    ],
    example: {
      problem: "Solve $x^3 - x - 1 = 0$ in $[1, 2]$.",
      solution: "Root converges to $1.3247$."
    },
    exampleInput: [
      "f(x): x**3 - x - 1",
      "a: 1",
      "b: 2",
      "tolerance: 1e-6"
    ]
  },
  "newton-raphson": {
    id: "newton-raphson",
    name: "Newton-Raphson Method",
    category: "root-finding",
    definition: "An open method that uses the tangent line of the function at a current approximation to find the next approximation. It boasts quadratic convergence.",
    formula: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
    algorithm: [
      "Provide an initial guess $x_0$.",
      "Compute $x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}$.",
      "Check error $|x_{n+1} - x_n|$.",
      "If error $<$ tolerance, stop.",
      "Else, update $x_n = x_{n+1}$ and repeat."
    ],
    conditions: [
      "$f'(x)$ must not be zero at any point in the iteration.",
      "$f(x)$ must be differentiable."
    ],
    useCases: [
      "Extremely fast when close to the root."
    ],
    example: {
      problem: "Solve $x^3 - x - 1 = 0$ with $x_0 = 1.5$.",
      solution: "Root converges to $1.3247$."
    },
    exampleInput: [
      "f(x): x**3 - x - 1",
      "f'(x): 3*x**2 - 1",
      "initial guess x0: 1.5",
      "tolerance: 1e-6"
    ]
  },
  "generalized-newton": {
    id: "generalized-newton",
    name: "Generalized Newton-Raphson",
    category: "root-finding",
    definition: "An extension of Newton-Raphson to solve for multiple roots or roots with known multiplicity $m$, restoring quadratic convergence.",
    formula: "x_{n+1} = x_n - m \\cdot \\frac{f(x_n)}{f'(x_n)}",
    algorithm: [
      "Identify the multiplicity $m$ of the root.",
      "Choose initial guess $x_0$.",
      "Evaluate $f(x_n)$ and $f'(x_n)$.",
      "Update $x_{n+1}$ using the generalized formula.",
      "Check convergence criteria."
    ],
    conditions: [
      "Function must be differentiable.",
      "Derivative must not evaluate to zero."
    ],
    useCases: [
      "Accelerating convergence when dealing with repeating roots of known multiplicity."
    ],
    example: {
      problem: "Solve $(x-1)^2(x+2) = 0$ which has a double root at x=1.",
      solution: "Generalized Newton with m=2 converges quadratically to $1.0$."
    },
    exampleInput: [
      "f(x): (x-1)**2 * (x+2)",
      "f'(x): 2*(x-1)*(x+2) + (x-1)**2",
      "initial guess x0: 1.5",
      "known root multiplicity m: 2",
      "tolerance: 1e-6"
    ]
  },
  "fixed-point-iteration": {
    id: "fixed-point-iteration",
    name: "Fixed Point Iteration Method",
    category: "root-finding",
    definition: "Rewrites $f(x) = 0$ as $x = \\Phi(x)$ and iterates the transformation until the sequence converges to a fixed point, which is the root.",
    formula: "x_{n+1} = \\Phi(x_n)",
    algorithm: [
      "Rewrite $f(x) = 0$ as $x = \\Phi(x)$.",
      "Choose initial guess $x_0$.",
      "Compute $x_{n+1} = \\Phi(x_n)$.",
      "Check error $|x_{n+1} - x_n|$.",
      "If error $<$ tolerance, stop. Else repeat."
    ],
    conditions: [
      "Convergence requires $|\\Phi'(x)| < 1$ near the root."
    ],
    useCases: [
      "Simple alternative to Newton-Raphson when $\\Phi(x)$ is easy to isolate and no derivative is available."
    ],
    example: {
      problem: "Solve $f(x) = x^3 - x - 1 = 0$, rewritten as $x = \\Phi(x) = \\sqrt[3]{x+1}$, starting at $x_0 = 1$.",
      solution: "$\\Phi'(x) = \\frac{1}{3}(x+1)^{-2/3}$, $|\\Phi'(1)| < 1$ so it converges: $1 \\to 1.2599 \\to 1.3123 \\to \\cdots \\to 1.3247$."
    }
  },

  // Systems of Nonlinear Equations
  "iteration-system": {
    id: "iteration-system",
    name: "Fixed Point Iteration Method",
    category: "nonlinear-systems",
    definition: "Solving a system by rearranging equations into explicit iterative forms $x_i = g_i(x_1, x_2, ...)$.",
    formula: "\\vec{x}^{(k+1)} = \\vec{g}(\\vec{x}^{(k)})",
    algorithm: [
      "Rearrange equations to isolate each variable.",
      "Provide an initial vector guess $\\vec{x}_0$.",
      "Substitute old values to compute new values.",
      "Check for convergence. Repeat."
    ],
    conditions: [
      "Converges if the absolute partial derivatives sum up to less than 1 (contractive mapping)."
    ],
    useCases: [
      "Simple systems where equations are easily isolatable."
    ],
    example: {
      problem: "Solve $x = \\frac{xy + 1}{2}$, $y = \\frac{x^2 - 3}{y}$.",
      solution: "Evaluates step by step to find fixed points."
    },
    exampleInput: [
      "Phi(x,y): (y**2 + 4) / 5",
      "Psi(x,y): (3*y*x**2 + 7) / 10",
      "initial guess x0: 0",
      "initial guess y0: 0",
      "tolerance: 1e-4"
    ]
  },
  "newton-system": {
    id: "newton-system",
    name: "Newton-Raphson for Systems",
    category: "nonlinear-systems",
    definition: "Solves a system $f(x,y)=0$, $g(x,y)=0$ by linearizing both equations about the current guess and solving the resulting 2x2 linear system with Cramer's rule.",
    formula: "h = \\frac{D_1}{D}, \\quad k = \\frac{D_2}{D}, \\quad D = \\begin{vmatrix} f_x & f_y \\\\ g_x & g_y \\end{vmatrix}",
    algorithm: [
      "Choose initial guess $(x_0, y_0)$.",
      "Let $x_1 = x_0 + h$, $y_1 = y_0 + k$, and linearize: $f_0 + h f_x + k f_y = 0$, $g_0 + h g_x + k g_y = 0$ (all evaluated at $(x_0, y_0)$).",
      "Compute $D = \\begin{vmatrix} f_x & f_y \\\\ g_x & g_y \\end{vmatrix}$, $D_1 = \\begin{vmatrix} -f_0 & f_y \\\\ -g_0 & g_y \\end{vmatrix}$, $D_2 = \\begin{vmatrix} f_x & -f_0 \\\\ g_x & -g_0 \\end{vmatrix}$.",
      "Solve for the corrections: $h = D_1/D$, $k = D_2/D$.",
      "Update $x_1 = x_0 + h$, $y_1 = y_0 + k$ and repeat until convergence."
    ],
    conditions: [
      "$D \\neq 0$ (Jacobian determinant non-singular)."
    ],
    useCases: [
      "Solving complex non-linear systems."
    ],
    example: {
      problem: "Solve $y^2 - 5y + 4 = 0$, $3x^2y - 10x + 7 = 0$ starting at $(0,0)$.",
      solution: "$h = 0.7$, $k = 0.8 \\Rightarrow x_1 = 0.7$, $y_1 = 0.8$."
    },
    exampleInput: [
      "f(x,y): y**2 - 5*y + 4",
      "g(x,y): 3*x**2*y - 10*x + 7",
      "df/dx: 0",
      "df/dy: 2*y - 5",
      "dg/dx: 6*x*y - 10",
      "dg/dy: 3*x**2",
      "initial guess x0: 0",
      "initial guess y0: 0"
    ]
  },

  // Interpolation
  "forward-difference": {
    id: "forward-difference",
    name: "Newton's Forward Difference",
    category: "finite-differences",
    definition: "Constructs interpolation polynomial using forward difference tables starting at the top.",
    formula: "P(x) = y_0 + u \\Delta y_0 + \\frac{u(u-1)}{2!} \\Delta^2 y_0 + ...",
    algorithm: [
      "Generate difference table.",
      "Determine spacing $h$ and calculate $u = \\frac{x - x_0}{h}$.",
      "Substitute values from the top row of the table into formula.",
      "Evaluate sum."
    ],
    conditions: [
      "Equally spaced intervals of $x$."
    ],
    useCases: [
      "Interpolating values near the beginning of the table."
    ],
    example: {
      problem: "Find $y$ at $x=1.5$ given table: $x=[1, 2, 3]$, $y=[1, 4, 9]$.",
      solution: "Using Forward difference, $y = 2.25$."
    },
    exampleInput: [
      "number of data points: 3",
      "x-values: 1 2 3",
      "y-values: 1 4 9",
      "target x: 1.5"
    ]
  },
  "backward-difference": {
    id: "backward-difference",
    name: "Newton's Backward Difference",
    category: "finite-differences",
    definition: "Constructs interpolation polynomial using backward difference table starting at the bottom.",
    formula: "P(x) = y_n + u \\nabla y_n + \\frac{u(u+1)}{2!} \\nabla^2 y_n + ...",
    algorithm: [
      "Generate difference table.",
      "Calculate $u = \\frac{x - x_n}{h}$.",
      "Substitute values from the bottom row.",
      "Evaluate sum."
    ],
    conditions: [
      "Equally spaced intervals."
    ],
    useCases: [
      "Interpolating values near the end of the table."
    ],
    example: {
      problem: "Find $y$ at $x=2.5$ given $x=[1, 2, 3]$, $y=[1, 4, 9]$.",
      solution: "Using Backward difference, $y = 6.25$."
    },
    exampleInput: [
      "number of data points: 3",
      "x-values: 1 2 3",
      "y-values: 1 4 9",
      "target x: 2.5"
    ]
  },
  "gauss-forward": {
    id: "gauss-forward",
    name: "Gauss Forward Interpolation",
    category: "finite-differences",
    definition: "An interpolation formula centered on the origin $y_0$, mixing forward and backward differences around it. Used for interpolating near the middle of an equally-spaced table, in the first half of the interval between two central points.",
    formula: "y_p = y_0 + p\\Delta y_0 + \\frac{p(p-1)}{2!}\\Delta^2 y_{-1} + \\frac{p(p+1)(p-1)}{3!}\\Delta^3 y_{-1} + \\frac{p(p+1)(p-1)(p-2)}{4!}\\Delta^4 y_{-2} + \\cdots",
    algorithm: [
      "Construct the difference table and pick the origin row $y_0$ closest to (and just before) the target $x$.",
      "Compute $p = \\frac{x - x_0}{h}$.",
      "Substitute alternating even/odd-order differences centered at $y_0$ (using $\\Delta^2 y_{-1}$, $\\Delta^3 y_{-1}$, $\\Delta^4 y_{-2}$, etc.) into the formula.",
      "Evaluate the sum."
    ],
    conditions: [
      "Equally spaced intervals of $x$.",
      "Best when $0 < p < 0.5$ (target is in the first half of the interval past $x_0$)."
    ],
    useCases: [
      "Interpolating values near the middle of the table, slightly ahead of a central point."
    ],
    example: {
      problem: "Interpolate $y_p$ using differences centered around $y_0$ with $p = \\frac{x - x_0}{h}$.",
      solution: "Apply the Gauss Forward formula term by term using the difference table's central diagonal."
    },
    exampleInput: [
      "number of data points: 5",
      "x-values: 0 1 2 3 4",
      "y-values: 0 1 4 9 16",
      "target x: 2.25"
    ]
  },
  "gauss-backward": {
    id: "gauss-backward",
    name: "Gauss Backward Interpolation",
    category: "finite-differences",
    definition: "The companion formula to Gauss Forward, also centered on $y_0$, but used for interpolating in the second half of the interval, just before a central point.",
    formula: "y_p = y_0 + p\\Delta y_0 + \\frac{p(p+1)}{2!}\\Delta^2 y_{-1} + \\frac{p(p+1)(p-1)}{3!}\\Delta^3 y_{-2} + \\frac{p(p+1)(p+2)(p-1)}{4!}\\Delta^4 y_{-2} + \\cdots",
    algorithm: [
      "Construct the difference table and pick the origin row $y_0$ closest to (and just after) the target $x$.",
      "Compute $p = \\frac{x - x_0}{h}$ (typically negative, since the target is just before $x_0$).",
      "Substitute the centered differences into the formula.",
      "Evaluate the sum."
    ],
    conditions: [
      "Equally spaced intervals of $x$.",
      "Best when $-0.5 < p < 0$ (target is in the second half of the interval just before $x_0$)."
    ],
    useCases: [
      "Interpolating values near the middle of the table, slightly behind a central point."
    ],
    example: {
      problem: "Interpolate $y_p$ using the Gauss Backward formula centered around $y_0$.",
      solution: "Apply the formula term by term using the difference table's central diagonal."
    },
    exampleInput: [
      "number of data points: 5",
      "x-values: 0 1 2 3 4",
      "y-values: 0 1 4 9 16",
      "target x: 1.75"
    ]
  },
  "stirling": {
    id: "stirling",
    name: "Stirling's Interpolation Formula",
    category: "finite-differences",
    definition: "Averages the Gauss Forward and Gauss Backward formulas, giving a symmetric formula centered on $y_0$ that's most accurate right around the middle of the table.",
    formula: "y_p = y_0 + p\\left(\\frac{\\Delta y_0 + \\Delta y_{-1}}{2}\\right) + \\frac{p^2}{2!}\\Delta^2 y_{-1} + \\frac{p(p^2-1)}{3!}\\left(\\frac{\\Delta^3 y_{-1} + \\Delta^3 y_{-2}}{2}\\right) + \\frac{p^2(p^2-1)}{4!}\\Delta^4 y_{-2} + \\cdots",
    algorithm: [
      "Construct the difference table and pick the origin row $y_0$ closest to the target $x$.",
      "Compute $p = \\frac{x - x_0}{h}$.",
      "For each odd-order term, average the two adjacent differences (e.g. $\\frac{\\Delta y_0 + \\Delta y_{-1}}{2}$); even-order terms use a single centered difference directly.",
      "Evaluate the sum."
    ],
    conditions: [
      "Equally spaced intervals of $x$.",
      "Most accurate when $-0.25 < p < 0.25$, i.e. the target is very close to $x_0$."
    ],
    useCases: [
      "High-accuracy interpolation near the center of a table."
    ],
    example: {
      problem: "Estimate $\\cos(0.17)$ from a table of $\\cos(x)$ at $x = 0.10, 0.15, 0.20, 0.25, 0.30$.",
      solution: "Using Stirling's formula centered at $x_0 = 0.15$: result approx $0.9856$."
    },
    exampleInput: [
      "number of data points: 5",
      "x-values: 0.10 0.15 0.20 0.25 0.30",
      "y-values: 0.9950 0.9888 0.9801 0.9689 0.9553",
      "target x: 0.17"
    ]
  },
  "bessel": {
    id: "bessel",
    name: "Bessel's Interpolation Formula",
    category: "finite-differences",
    definition: "Similar in spirit to Stirling's formula, but centered between two points $y_0$ and $y_1$ rather than on a single origin — most accurate for targets near the midpoint of an interval.",
    formula: "y_p = \\frac{y_0 + y_1}{2} + \\left(p - \\frac{1}{2}\\right)\\Delta y_0 + \\frac{p(p-1)}{2!}\\left(\\frac{\\Delta^2 y_{-1} + \\Delta^2 y_0}{2}\\right) + \\frac{p(p-1)\\left(p-\\frac{1}{2}\\right)}{3!}\\Delta^3 y_{-1} + \\cdots",
    algorithm: [
      "Construct the difference table and pick the two central rows $y_0$, $y_1$ that bracket the target $x$.",
      "Compute $p = \\frac{x - x_0}{h}$.",
      "Average the even-order differences straddling the interval (e.g. $\\frac{\\Delta^2 y_{-1} + \\Delta^2 y_0}{2}$); odd-order terms use a single difference directly.",
      "Evaluate the sum."
    ],
    conditions: [
      "Equally spaced intervals of $x$.",
      "Most accurate when $p \\approx 0.5$, i.e. the target sits near the midpoint between $x_0$ and $x_1$."
    ],
    useCases: [
      "High-accuracy interpolation for a target roughly halfway between two consecutive table points."
    ],
    example: {
      problem: "Interpolate $y_p$ for a target roughly midway between $x_0$ and $x_1$.",
      solution: "Apply Bessel's formula term by term using differences straddling the $y_0$-$y_1$ interval."
    },
    exampleInput: [
      "number of data points: 5",
      "x-values: 0 1 2 3 4",
      "y-values: 0 1 4 9 16",
      "target x: 2.5"
    ]
  },
  "everett": {
    id: "everett",
    name: "Everett's Interpolation Formula",
    category: "finite-differences",
    definition: "Uses only even-order differences from two adjacent origins $y_0$ and $y_1$, skipping odd-order differences entirely. Extensively used in practice and considered one of the most reliable central-difference interpolation formulas.",
    formula: "y_p = q y_0 + \\frac{q(q^2-1^2)}{3!}\\Delta^2 y_{-1} + \\frac{q(q^2-1^2)(q^2-2^2)}{5!}\\Delta^4 y_{-2} + \\cdots + p y_1 + \\frac{p(p^2-1^2)}{3!}\\Delta^2 y_0 + \\frac{p(p^2-1^2)(p^2-2^2)}{5!}\\Delta^4 y_{-1} + \\cdots",
    algorithm: [
      "Construct the difference table and identify the two rows $y_0$, $y_1$ bracketing the target $x$.",
      "Compute $p = \\frac{x - x_0}{h}$ and $q = 1 - p$.",
      "Build the $y_0$-side sum using $q$ and even-order differences $\\Delta^2 y_{-1}, \\Delta^4 y_{-2}, \\dots$",
      "Build the $y_1$-side sum using $p$ and even-order differences $\\Delta^2 y_0, \\Delta^4 y_{-1}, \\dots$",
      "Add both sums together."
    ],
    conditions: [
      "Equally spaced intervals of $x$.",
      "Only even-order differences are needed — no odd-order differences at all."
    ],
    useCases: [
      "A go-to formula for central interpolation: skipping odd-order differences makes it simpler to compute by hand than Bessel's or Stirling's while remaining highly accurate. Heavily emphasized in class as the preferred central-interpolation formula."
    ],
    example: {
      problem: "Interpolate $y_p$ for a target between $x_0$ and $x_1$ using only even-order differences.",
      solution: "Apply Everett's formula, combining the $q y_0$-side and $p y_1$-side sums."
    },
    exampleInput: [
      "number of data points: 5",
      "x-values: 0 1 2 3 4",
      "y-values: 0 1 4 9 16",
      "target x: 2.5"
    ]
  },
  "lagrange": {
    id: "lagrange",
    name: "Lagrange's Interpolation Formula",
    category: "finite-differences",
    definition: "Builds the interpolating polynomial directly as a weighted sum of the given $y$ values, with no difference table required. Works for unequally spaced data, unlike the other interpolation formulas.",
    formula: "y = \\sum_{i=0}^{n} y_i L_i(x), \\quad L_i(x) = \\prod_{\\substack{j=0 \\\\ j \\neq i}}^{n} \\frac{x - x_j}{x_i - x_j}",
    algorithm: [
      "List all data points $(x_i, y_i)$.",
      "For each $i$, build the basis polynomial $L_i(x)$: the product of $\\frac{x - x_j}{x_i - x_j}$ over every other point $j \\neq i$.",
      "Note $L_i(x_i) = 1$ and $L_i(x_j) = 0$ for $i \\neq j$ — each basis polynomial is 1 at its own point and 0 at every other data point.",
      "Sum $y_i L_i(x)$ over all $i$."
    ],
    conditions: [
      "Works for both equally and unequally spaced data — no spacing assumption needed."
    ],
    useCases: [
      "Interpolating data that isn't equally spaced, where the difference-table formulas don't apply."
    ],
    example: {
      problem: "Linear interpolation ($n=1$) between two points $(x_0, y_0)$ and $(x_1, y_1)$.",
      solution: "$y = y_0 \\frac{x-x_1}{x_0-x_1} + y_1 \\frac{x-x_0}{x_1-x_0}$."
    },
    exampleInput: [
      "number of data points: 3",
      "x-values: 2 5 8",
      "y-values: 4 25 64",
      "target x: 6"
    ]
  },
  "newton-divided-difference": {
    id: "newton-divided-difference",
    name: "Newton's General Interpolation (Divided Differences)",
    category: "finite-differences",
    definition: "An alternative to Lagrange's formula for unequally spaced data, building the polynomial incrementally from a table of divided differences, similar in spirit to the forward/backward difference tables.",
    formula: "y = y_0 + (x-x_0)[x_0,x_1] + (x-x_0)(x-x_1)[x_0,x_1,x_2] + \\cdots",
    algorithm: [
      "Construct the divided difference table: first order $[x_0,x_1] = \\frac{y_1-y_0}{x_1-x_0}$, second order $[x_0,x_1,x_2] = \\frac{[x_1,x_2]-[x_0,x_1]}{x_2-x_0}$, and so on.",
      "Substitute the first row of the divided difference table into Newton's general interpolation formula.",
      "Evaluate the sum at the target $x$."
    ],
    conditions: [
      "Works for unequally spaced data (like Lagrange's formula)."
    ],
    useCases: [
      "Unequally spaced data where an incrementally-built (rather than fully symmetric) formula is preferred, e.g. when more data points might be added later."
    ],
    example: {
      problem: "Find $f(301)$ from data $(300, 2.4771), (304, 2.4829), (305, 2.4873), (307, 2.4871)$.",
      solution: "$y \\approx 2.4771 + (301-300)(0.00145) = 2.4796$."
    },
    exampleInput: [
      "number of data points: 4",
      "x-values: 300 304 305 307",
      "y-values: 2.4771 2.4829 2.4873 2.4871",
      "target x: 301"
    ]
  },

  // Numerical Differentiation
  "newton-forward-differentiation": {
    id: "newton-forward-differentiation",
    name: "Differentiation via Newton's Forward Formula",
    category: "numerical-differentiation",
    definition: "Derives numerical formulas for $\\frac{dy}{dx}$ and $\\frac{d^2y}{dx^2}$ by differentiating Newton's Forward Interpolation polynomial with respect to $x$.",
    formula: "\\frac{dy}{dx} = \\frac{1}{h}\\left[\\Delta y_0 + \\frac{2p-1}{2!}\\Delta^2 y_0 + \\frac{3p^2-6p+2}{3!}\\Delta^3 y_0 + \\cdots\\right]",
    algorithm: [
      "Construct the forward difference table.",
      "Compute $p = \\frac{x - x_0}{h}$ at the point where the derivative is needed.",
      "Substitute into the first-derivative formula (uses $\\frac{dy}{dx} = \\frac{dy}{dp}\\cdot\\frac{dp}{dx} = \\frac{1}{h}\\frac{dy}{dp}$).",
      "At $x = x_0$ ($p=0$), this simplifies to $\\left(\\frac{dy}{dx}\\right)_{x_0} = \\frac{1}{h}\\left[\\Delta y_0 - \\frac{1}{2}\\Delta^2 y_0 + \\frac{1}{3}\\Delta^3 y_0 - \\cdots\\right]$.",
      "For the second derivative, use $\\frac{d^2y}{dx^2} = \\frac{1}{h^2}\\left[\\Delta^2 y_0 + \\frac{6p-6}{3!}\\Delta^3 y_0 + \\cdots\\right]$, which at $x_0$ simplifies to $\\frac{1}{h^2}\\left[\\Delta^2 y_0 - \\Delta^3 y_0 + \\frac{11}{12}\\Delta^4 y_0 - \\cdots\\right]$."
    ],
    conditions: [
      "Equally spaced intervals of $x$.",
      "Most accurate near $x_0$, the start of the difference table."
    ],
    useCases: [
      "Estimating derivatives from tabulated data near the beginning of the table."
    ],
    example: {
      problem: "Estimate $\\left(\\frac{dy}{dx}\\right)_{x_0}$ from a forward difference table.",
      solution: "$\\left(\\frac{dy}{dx}\\right)_{x_0} = \\frac{1}{h}\\left[\\Delta y_0 - \\frac{1}{2}\\Delta^2 y_0 + \\frac{1}{3}\\Delta^3 y_0 - \\cdots\\right]$."
    }
  },
  "central-difference-derivative": {
    id: "central-difference-derivative",
    name: "Central Difference Formulas (Differentiation)",
    category: "numerical-differentiation",
    definition: "The simplest and most commonly used numerical differentiation formulas: estimate a derivative using function values symmetric around the point of interest.",
    formula: "y'(x) = \\frac{y(x+h) - y(x-h)}{2h}, \\quad y''(x) = \\frac{y(x+h) - 2y(x) + y(x-h)}{h^2}",
    algorithm: [
      "Pick step size $h$ and identify $y(x-h)$, $y(x)$, $y(x+h)$ from the table (or by evaluating the function).",
      "For the first derivative, compute $\\frac{y(x+h) - y(x-h)}{2h}$.",
      "For the second derivative, compute $\\frac{y(x+h) - 2y(x) + y(x-h)}{h^2}$."
    ],
    conditions: [
      "Requires function values on both sides of $x$ (i.e. $x$ can't be at the very start or end of the table).",
      "Equally spaced points."
    ],
    useCases: [
      "General-purpose derivative estimation from tabulated or computed data; also the building block for the Boundary Value Problem Finite Difference Method."
    ],
    example: {
      problem: "Estimate $y_i'$ and $y_i''$ using central differences at an interior table point $x_i$.",
      solution: "$y_i' = \\frac{y_{i+1} - y_{i-1}}{2h}$, $y_i'' = \\frac{y_{i+1} - 2y_i + y_{i-1}}{h^2}$."
    }
  },

  // ODEs
  "euler": {
    id: "euler",
    name: "Euler's Method",
    category: "ode",
    definition: "A first-order numerical procedure for solving ODEs. It uses the tangent line at the current point to step forward.",
    formula: "y_{n+1} = y_n + h f(x_n, y_n)",
    algorithm: [
      "Start with $x_0$, $y_0$, step size $h$.",
      "Calculate slope = $f(x_n, y_n)$.",
      "Compute $y_{n+1} = y_n + h \\cdot \\text{slope}$.",
      "Update $x_{n+1} = x_n + h$.",
      "Repeat."
    ],
    conditions: [
      "Requires initial condition $(x_0, y_0)$."
    ],
    useCases: [
      "Quick, basic approximation of simple differential equations."
    ],
    example: {
      problem: "Solve $\\frac{dy}{dx} = x + y$ with $x_0=0$, $y_0=1$, $h=0.1$ to find $y(0.2)$.",
      solution: "Iteration 1: $y(0.1) = 1.1$. Iteration 2: $y(0.2) = 1.22$."
    },
    exampleInput: [
      "dy/dx = f(x,y): x + y",
      "x0: 0",
      "y0: 1",
      "step size h: 0.1",
      "number of steps: 2"
    ]
  },
  "modified-euler": {
    id: "modified-euler",
    name: "Modified Euler (Heun's Method)",
    category: "ode",
    definition: "A predictor-corrector method that averages the slope at the current step and the predicted next step for better accuracy.",
    formula: "y_{n+1} = y_n + \\frac{h}{2} [ f(x_n, y_n) + f(x_{n+1}, y_{n+1}^*) ]",
    algorithm: [
      "Predict $y_{n+1}^* = y_n + h f(x_n, y_n)$.",
      "Correct $y_{n+1}$ using the averaged slope at $x_n$ and predicted $x_{n+1}$.",
      "Repeat."
    ],
    conditions: [
      "Requires initial conditions."
    ],
    useCases: [
      "Better convergence than standard Euler."
    ],
    example: {
      problem: "Solve $\\frac{dy}{dx} = x + y$ with $x_0=0$, $y_0=1$, $h=0.1$.",
      solution: "Step 1: Predict $y^*(0.1)=1.1$, Correct $y(0.1)=1.11$."
    },
    exampleInput: [
      "dy/dx = f(x,y): x + y",
      "x0: 0",
      "y0: 1",
      "step size h: 0.1",
      "number of steps: 2"
    ]
  },
  "rk4": {
    id: "rk4",
    name: "Runge-Kutta 4th Order",
    category: "ode",
    definition: "A highly accurate fourth-order method that takes a weighted average of four slope estimates across the step interval.",
    formula: "y_{n+1} = y_n + \\frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4)",
    algorithm: [
      "Calculate $k_1 = h f(x_n, y_n)$.",
      "Calculate $k_2 = h f(x_n + \\frac{h}{2}, y_n + \\frac{k_1}{2})$.",
      "Calculate $k_3 = h f(x_n + \\frac{h}{2}, y_n + \\frac{k_2}{2})$.",
      "Calculate $k_4 = h f(x_n + h, y_n + k_3)$.",
      "Update $y_{n+1} = y_n + \\frac{k_1 + 2k_2 + 2k_3 + k_4}{6}$."
    ],
    conditions: [
      "Requires initial condition."
    ],
    useCases: [
      "Standard solver for ODEs in scientific computing."
    ],
    example: {
      problem: "Solve $\\frac{dy}{dx} = x + y$ with $x_0=0$, $y_0=1$, $h=0.1$.",
      solution: "Converges with high accuracy $O(h^4)$."
    },
    exampleInput: [
      "dy/dx = f(x,y): x + y",
      "x0: 0",
      "y0: 1",
      "step size h: 0.1",
      "number of steps: 2"
    ]
  },
  "rk2": {
    id: "rk2",
    name: "Runge-Kutta 2nd Order (RK2)",
    category: "ode",
    definition: "A simpler, cheaper alternative to RK4: samples the slope twice per step (once at the start, once at a trial endpoint) and averages them, instead of Euler's single slope sample.",
    formula: "k_1 = h f(x_n, y_n), \\quad k_2 = h f(x_n + h, y_n + k_1), \\quad y_{n+1} = y_n + \\frac{1}{2}(k_1 + k_2)",
    algorithm: [
      "Calculate $k_1 = h f(x_n, y_n)$, the slope at the start of the step.",
      "Calculate $k_2 = h f(x_n + h, y_n + k_1)$, the slope estimated at the trial endpoint reached using $k_1$ (i.e. an Euler step).",
      "Update $y_{n+1} = y_n + \\frac{1}{2}(k_1 + k_2)$, averaging the two slopes."
    ],
    conditions: [
      "Requires initial condition $(x_0, y_0)$."
    ],
    useCases: [
      "Better accuracy than plain Euler for roughly double the computation; a stepping stone between Euler and RK4."
    ],
    example: {
      problem: "Solve $\\frac{dy}{dx} = x + y$ with $x_0=0$, $y_0=1$, $h=0.1$.",
      solution: "Second-order accurate; more accurate than Euler, less than RK4 for the same step size."
    }
  },
  "taylor-series-method": {
    id: "taylor-series-method",
    name: "Taylor's Series Method",
    category: "ode",
    definition: "Solves an ODE by expanding the solution $y(x)$ as a Taylor series around the known starting point, using successive derivatives of $y$ obtained by repeatedly differentiating the ODE itself.",
    formula: "y(x) = y(x_0) + (x-x_0)y'(x_0) + \\frac{(x-x_0)^2}{2!}y''(x_0) + \\frac{(x-x_0)^3}{3!}y'''(x_0) + \\cdots",
    algorithm: [
      "Given $y' = f(x,y)$ and $y(x_0) = y_0$.",
      "Differentiate $y'$ successively (using the chain/product rule on the ODE itself) to get expressions for $y'', y''', \\dots$",
      "Evaluate each derivative at $x_0$.",
      "Substitute all the derivative values into the Taylor series.",
      "Compute $y$ at the desired $x$, adding terms until they're smaller than the required tolerance."
    ],
    conditions: [
      "Requires $y$ to be repeatedly differentiable, and the derivatives must be tractable to compute by hand.",
      "Stopping criterion for $N$ decimal places: add terms until $\\frac{(x-x_0)^n y_0^{(n)}}{n!} \\leq \\frac{1}{2}\\times 10^{-N}$."
    ],
    useCases: [
      "High-accuracy solution near the starting point when derivatives of $f$ are easy to compute by hand."
    ],
    example: {
      problem: "For $y'' - 2y' - y = 0$, $y(0)=1$, $y'(0)=0$, find $y(x)$ near $x=0$.",
      solution: "$y = y_0 + x y_0' + \\frac{x^2}{2!}y_0'' + \\frac{x^3}{3!}y_0''' + \\cdots$, with each derivative evaluated from the ODE itself."
    }
  },
  "picard-method": {
    id: "picard-method",
    name: "Picard's Method",
    category: "ode",
    definition: "Solves an ODE by converting it into an equivalent integral equation, then repeatedly substituting the previous approximation of $y$ back into the integral to refine the next one.",
    formula: "y_{n+1} = y_0 + \\int_{x_0}^x f(x, y_n) \\, dx",
    algorithm: [
      "Given $y' = f(x,y)$, $y(x_0) = y_0$, rewrite as the integral equation $y = y_0 + \\int_{x_0}^x f(x,y)\\,dx$.",
      "First iteration: $y_1 = y_0 + \\int_{x_0}^x f(x, y_0)\\,dx$, substituting the constant $y_0$ into $f$.",
      "Second iteration: $y_2 = y_0 + \\int_{x_0}^x f(x, y_1)\\,dx$, substituting the previous approximation $y_1$.",
      "Repeat, substituting each new $y_n$ back in, until the newest term added is smaller than the required tolerance."
    ],
    conditions: [
      "$f(x,y)$ must be integrable with respect to $x$ at each iteration.",
      "Stopping criterion for $N$ decimal places: stop once the last term in the series is $\\leq \\frac{1}{2}\\times 10^{-N}$."
    ],
    useCases: [
      "Building a closed-form polynomial approximation of the solution, rather than a table of discrete points like Euler/RK4."
    ],
    example: {
      problem: "For $y' = \\frac{x^2+y^2}{2}$, $y(0)=1$, find $y(0.21)$.",
      solution: "$y_2 = 1 + x + x^2 + \\frac{2}{3}x^3 + \\frac{x^4}{4} + \\frac{x^5}{20}$ is sufficient for 4 decimal places, giving $y(0.21) \\approx 1.2608$."
    }
  },

  // Integration
  "trapezoidal": {
    id: "trapezoidal",
    name: "Trapezoidal Rule",
    category: "integration",
    definition: "Approximates the area under a curve by dividing the interval into linear trapezoids.",
    formula: "I \\approx \\frac{h}{2} [ (y_0 + y_n) + 2 \\sum_{i=1}^{n-1} y_i ]",
    algorithm: [
      "Determine step size $h = \\frac{b - a}{n}$.",
      "Generate table of $x$ and $y$ values.",
      "Apply Trapezoidal formula.",
      "Compute final integral value."
    ],
    conditions: [
      "Interval $[a, b]$ is continuous."
    ],
    useCases: [
      "Integrating continuous functions with arbitrary interval partitions."
    ],
    example: {
      problem: "Integrate $x^2$ from $0$ to $1$ with $n=4$.",
      solution: "Integral value $\\approx 0.34375$ (Analytical value: $0.3333$)"
    },
    exampleInput: [
      "f(x): x**2",
      "lower limit a: 0",
      "upper limit b: 1",
      "subintervals n: 4"
    ]
  },
  "simpson-13": {
    id: "simpson-13",
    name: "Simpson's 1/3 Rule",
    category: "integration",
    definition: "Approximates the area under a curve using quadratic parabolas over adjacent pairs of subintervals.",
    formula: "I \\approx \\frac{h}{3} [ (y_0 + y_n) + 4 \\sum_{odd} y_i + 2 \\sum_{even} y_i ]",
    algorithm: [
      "Ensure subintervals count $n$ is even.",
      "Calculate $h = \\frac{b-a}{n}$.",
      "Apply Simpson's 1/3 formula using odd and even indices.",
      "Calculate result."
    ],
    conditions: [
      "$n$ must be an even integer."
    ],
    useCases: [
      "Higher precision integration than Trapezoidal."
    ],
    example: {
      problem: "Integrate $x^2$ from $0$ to $1$ with $n=4$.",
      solution: "Integral value $= 0.33333$."
    },
    exampleInput: [
      "f(x): x**2",
      "lower limit a: 0",
      "upper limit b: 1",
      "subintervals n (must be even): 4"
    ]
  },
  "simpson-38": {
    id: "simpson-38",
    name: "Simpson's 3/8 Rule",
    category: "integration",
    definition: "Approximates area using third-order (cubic) polynomials over triplets of subintervals.",
    formula: "I \\approx \\frac{3h}{8} [ (y_0 + y_n) + 3 \\sum_{i \\neq 3k} y_i + 2 \\sum_{i=3, 6...} y_i ]",
    algorithm: [
      "Ensure $n$ is a multiple of 3.",
      "Compute $h = \\frac{b-a}{n}$.",
      "Apply Simpson's 3/8 formula.",
      "Compute result."
    ],
    conditions: [
      "$n$ must be a multiple of 3."
    ],
    useCases: [
      "Highly accurate integration, especially when dealing with specific sample size partitions."
    ],
    example: {
      problem: "Integrate $x^2$ from $0$ to $1$ with $n=3$.",
      solution: "Integral value $= 0.33333$."
    },
    exampleInput: [
      "f(x): x**2",
      "lower limit a: 0",
      "upper limit b: 1",
      "subintervals n (multiple of 3): 3"
    ]
  },
  "double-integration": {
    id: "double-integration",
    name: "Double Integration (Trapezoidal Rule)",
    category: "integration",
    definition: "Extends the Trapezoidal Rule to two dimensions, approximating $\\int_a^b \\int_c^d f(x,y)\\,dx\\,dy$ over a rectangular region by applying the Trapezoidal Rule in both directions.",
    formula: "I \\approx \\frac{hk}{4} \\sum_{i,j} w_{ij}\\, f(x_i, y_j)",
    algorithm: [
      "Divide the rectangle $[a,b] \\times [c,d]$ into a grid using step sizes $h$ (in $x$) and $k$ (in $y$).",
      "Compute $f(x,y)$ at every grid point.",
      "Apply the Trapezoidal Rule along each row (fixed $y$) to integrate over $x$.",
      "Apply the Trapezoidal Rule again over the resulting row-integrals to integrate over $y$."
    ],
    conditions: [
      "$f(x,y)$ continuous over the rectangle $[a,b] \\times [c,d]$."
    ],
    useCases: [
      "Approximating a double integral over a rectangular domain when an analytic solution isn't available."
    ],
    example: {
      problem: "Evaluate $I = \\int_0^1 \\int_0^1 e^{x^2+y^2}\\,dx\\,dy$ using $h=0.5$, $k=0.25$.",
      solution: "Build the $f(x,y)$ grid, apply the Trapezoidal Rule across $x$ for each row, then across $y$ on the row results."
    }
  },

  // Boundary Value Problems (Finite Difference Method)
  "bvp-finite-difference": {
    id: "bvp-finite-difference",
    name: "Boundary Value Problems - Finite Difference Method",
    category: "bvp",
    definition: "Solves a second-order ODE with boundary conditions given at both ends of the interval (rather than an initial condition), by replacing the derivatives with central difference approximations at each interior grid point, turning the ODE into a system of linear (or nonlinear) algebraic equations.",
    formula: "\\frac{y_{i+1} - 2y_i + y_{i-1}}{h^2} + p(x_i)\\frac{y_{i+1} - y_{i-1}}{2h} + q(x_i)y_i = r(x_i)",
    algorithm: [
      "Given $y'' + p(x)y' + q(x)y = r(x)$ with $y(x_0) = a$, $y(x_n) = b$.",
      "Divide $[x_0, x_n]$ into $n$ equal parts with step $h$.",
      "At each interior point $i = 1, \\dots, n-1$, replace $y_i'$ and $y_i''$ with the central difference formulas $y_i' = \\frac{y_{i+1}-y_{i-1}}{2h}$, $y_i'' = \\frac{y_{i+1}-2y_i+y_{i-1}}{h^2}$.",
      "This gives one algebraic equation per interior point, forming a system of $(n-1)$ equations in the unknowns $y_1, \\dots, y_{n-1}$ (the boundary values $y_0, y_n$ are already known).",
      "Solve the resulting system — often tridiagonal, so the Thomas Algorithm applies directly."
    ],
    conditions: [
      "Boundary values $y(x_0)$ and $y(x_n)$ must both be given (unlike IVP methods, which only need a starting point).",
      "If $q(x)y$ or $r(x)$ involves $y$ nonlinearly (e.g. $e^y$), the resulting system is nonlinear and needs an iterative solver rather than direct substitution.",
      "Note: some worked examples simplify a term like $e^{y_i}$ down to $e^{2x_i}$ as a one-off shortcut specific to that particular problem's numbers — that substitution is not part of the general method and shouldn't be reused for a different ODE."
    ],
    useCases: [
      "Solving 2nd-order ODEs where the conditions are split between two endpoints instead of both being given at the start."
    ],
    example: {
      problem: "Solve $y'' - 2y' - e^y = \\frac{1}{x+1}$, $y(0)=0$, $y(1)=1$, with $n=4$.",
      solution: "Substituting central differences at each interior point gives one equation per point involving $e^{y_i}$; solving the resulting (nonlinear, since $e^{y_i}$ depends on the unknown $y_i$) system gives $y_1, y_2, y_3$."
    }
  },

  // Linear Systems
  "lu-decomposition": {
    id: "lu-decomposition",
    name: "LU Decomposition",
    category: "linear-systems",
    definition: "A direct method that factors a matrix $A$ into a lower triangular matrix $L$ and an upper triangular matrix $U$ such that $A = LU$.",
    formula: "A = LU \\Rightarrow L \\vec{y} = \\vec{b}, \\quad U \\vec{x} = \\vec{y}",
    algorithm: [
      "Factorize $A$ into $L$ and $U$.",
      "Solve $L\\vec{y} = \\vec{b}$ using forward substitution.",
      "Solve $U\\vec{x} = \\vec{y}$ using backward substitution."
    ],
    conditions: [
      "Matrix $A$ must be square and invertible.",
      "Principal minors must be non-zero for decomposition without pivoting."
    ],
    useCases: [
      "Efficient for solving systems with the same matrix $A$ but multiple right-hand sides $\\vec{b}$."
    ],
    example: {
      problem: "Solve $Ax = b$ given $A = [[2, 3], [1, 4]]$.",
      solution: "Finds $L$ and $U$ and solves exactly."
    },
    exampleInput: [
      "matrix size n: 3",
      "row 1 of A: 2 3 1",
      "row 2 of A: 1 2 3",
      "row 3 of A: 3 1 2",
      "b: 9 6 8"
    ]
  },
  "thomas-algorithm": {
    id: "thomas-algorithm",
    name: "Thomas Algorithm",
    category: "linear-systems",
    definition: "A simplified form of Gaussian elimination specifically optimized for solving tridiagonal systems of equations.",
    formula: "c'_i = \\frac{c_i}{b_i - a_i c'_{i-1}}, \\quad d'_i = \\frac{d_i - a_i d'_{i-1}}{b_i - a_i c'_{i-1}}",
    algorithm: [
      "Perform forward sweep to modify $c$ and $d$ coefficients.",
      "Perform backward substitution to find the solution $x$."
    ],
    conditions: [
      "Matrix must be strictly diagonally dominant to guarantee numerical stability."
    ],
    useCases: [
      "Solving tridiagonal matrices efficiently in $O(n)$ time."
    ],
    example: {
      problem: "Solve a tridiagonal system arising from 1D finite differences.",
      solution: "Calculates the solution vector linearly."
    },
    exampleInput: [
      "number of equations n: 3",
      "sub-diagonal a: 0 -1 -1",
      "main diagonal b: 2 2 2",
      "super-diagonal c: -1 -1 0",
      "right-hand side d: 1 0 1"
    ]
  },
  "gauss-jacobi": {
    id: "gauss-jacobi",
    name: "Gauss-Jacobi Iteration",
    category: "linear-systems",
    definition: "An iterative method for solving linear systems where updates are computed simultaneously using only values from the previous iteration.",
    formula: "x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j \\neq i} a_{ij} x_j^{(k)} \\right)",
    algorithm: [
      "Choose an initial guess vector $\\vec{x}^{(0)}$.",
      "For each $i$, compute $x_i^{(k+1)}$ using the Jacobi formula.",
      "Calculate error $\\|\\vec{x}^{(k+1)} - \\vec{x}^{(k)}\\|_\\infty$.",
      "Repeat until error is below tolerance."
    ],
    conditions: [
      "Matrix $A$ should ideally be strictly diagonally dominant for guaranteed convergence."
    ],
    useCases: [
      "Large sparse systems, highly parallelizable."
    ],
    example: {
      problem: "Solve a diagonally dominant system iteratively.",
      solution: "Converges to the solution vector within a specified tolerance."
    },
    exampleInput: [
      "number of equations n: 3",
      "row 1 of A: 2 -1 0",
      "row 2 of A: -1 3 -1",
      "row 3 of A: 0 -1 2",
      "b: 1 8 -5",
      "initial guess x0: 0 0 0"
    ]
  },
  "gauss-seidel": {
    id: "gauss-seidel",
    name: "Gauss-Seidel Iteration",
    category: "linear-systems",
    definition: "An improvement over Jacobi iteration that uses the most recently updated values as soon as they are available.",
    formula: "x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j=1}^{i-1} a_{ij} x_j^{(k+1)} - \\sum_{j=i+1}^{n} a_{ij} x_j^{(k)} \\right)",
    algorithm: [
      "Choose an initial guess vector.",
      "For each $i$, compute $x_i^{(k+1)}$ using newly computed values for $j < i$.",
      "Check convergence.",
      "Repeat."
    ],
    conditions: [
      "Matrix $A$ should be strictly diagonally dominant or symmetric positive definite."
    ],
    useCases: [
      "Faster convergence than Gauss-Jacobi; uses less memory."
    ],
    example: {
      problem: "Solve a diagonally dominant system iteratively.",
      solution: "Converges roughly twice as fast as Jacobi."
    },
    exampleInput: [
      "number of equations n: 3",
      "row 1 of A: 2 -1 0",
      "row 2 of A: -1 3 -1",
      "row 3 of A: 0 -1 2",
      "b: 1 8 -5",
      "initial guess x0: 0 0 0"
    ]
  },
  "matrix-norms": {
    id: "matrix-norms",
    name: "Matrix Norms",
    category: "linear-systems",
    definition: "Ways to measure the 'size' of a matrix with a single number, used to bound errors and check convergence conditions for iterative methods like Gauss-Jacobi and Gauss-Seidel.",
    formula: "\\|A\\|_1 = \\max_j \\sum_i |a_{ij}|, \\quad \\|A\\|_e = \\left[\\sum_{i,j} |a_{ij}|^2\\right]^{1/2}, \\quad \\|A\\|_\\infty = \\max_i \\sum_j |a_{ij}|",
    algorithm: [
      "Column norm $\\|A\\|_1$: sum the absolute values down each column, take the maximum column sum.",
      "Euclidean (Frobenius) norm $\\|A\\|_e$: square every entry, sum them all, take the square root.",
      "Row norm $\\|A\\|_\\infty$: sum the absolute values across each row, take the maximum row sum."
    ],
    conditions: [
      "$\\|A\\| \\geq 0$, and $\\|A\\| = 0$ if and only if $A = 0$.",
      "$\\|cA\\| = |c| \\cdot \\|A\\|$.",
      "$\\|A+B\\| \\leq \\|A\\| + \\|B\\|$ (triangle inequality).",
      "$\\|AB\\| \\leq \\|A\\| \\cdot \\|B\\|$ and $\\|A^p\\| \\leq \\|A\\|^p$."
    ],
    useCases: [
      "Bounding solution error in linear systems.",
      "Checking diagonal dominance / convergence conditions for iterative solvers like Gauss-Jacobi and Gauss-Seidel."
    ],
    example: {
      problem: "For $A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{bmatrix}$, find $\\|A\\|_1$, $\\|A\\|_e$, $\\|A\\|_\\infty$.",
      solution: "$\\|A\\|_1 = \\max[12, 15, 18] = 18$, $\\|A\\|_e \\approx 16.88$, $\\|A\\|_\\infty = \\max[6, 15, 24] = 24$."
    }
  },

  // Curve Fitting
  "linear-fit": {
    id: "linear-fit",
    name: "Linear Fit (Least Squares)",
    category: "curve-fitting",
    definition: "Finds the best-fitting straight line $y = ax + b$ through a set of data points by minimizing the sum of squared vertical distances between the data and the line.",
    formula: "\\sum y = a\\sum x + nb, \\quad \\sum xy = a\\sum x^2 + b\\sum x",
    algorithm: [
      "From the data points, compute $\\sum x$, $\\sum y$, $\\sum xy$, $\\sum x^2$, and $n$ (number of points).",
      "Substitute into the two normal equations.",
      "Solve the resulting 2x2 linear system for $a$ (slope) and $b$ (intercept)."
    ],
    conditions: [
      "Data should follow a roughly linear trend for the fit to be meaningful."
    ],
    useCases: [
      "Fitting a straight-line trend to noisy or scattered data."
    ],
    example: {
      problem: "Fit $y = ax + b$ to a set of $(x, y)$ data points using the normal equations.",
      solution: "Solve $\\sum y = a\\sum x + nb$ and $\\sum xy = a\\sum x^2 + b\\sum x$ simultaneously for $a$ and $b$."
    }
  },
  "parabolic-fit": {
    id: "parabolic-fit",
    name: "Parabolic Fit (Least Squares)",
    category: "curve-fitting",
    definition: "Extends the Linear Fit idea to a quadratic curve $y = a_0 + a_1 x + a_2 x^2$, using three normal equations instead of two.",
    formula: "\\sum y = a_0 n + a_1\\sum x + a_2\\sum x^2, \\quad \\sum xy = a_0\\sum x + a_1\\sum x^2 + a_2\\sum x^3, \\quad \\sum x^2y = a_0\\sum x^2 + a_1\\sum x^3 + a_2\\sum x^4",
    algorithm: [
      "From the data, compute all needed power sums: $\\sum x, \\sum x^2, \\sum x^3, \\sum x^4, \\sum y, \\sum xy, \\sum x^2y$.",
      "Substitute into the three normal equations.",
      "Solve the resulting 3x3 linear system (e.g. with LU Decomposition) for $a_0, a_1, a_2$."
    ],
    conditions: [
      "Data should follow a roughly quadratic (parabolic) trend for the fit to be meaningful."
    ],
    useCases: [
      "Fitting a curved trend to data that a straight line doesn't capture well."
    ],
    example: {
      problem: "Fit $y = a_0 + a_1x + a_2x^2$ to $(1,0.63), (3,2.05), (4,4.08), (6,10.78)$.",
      solution: "Normal equations: $13.54 = 4a_0 + 14a_1 + 62a_2$, $86.78 = 14a_0 + 62a_1 + 308a_2$, $472.44 = 62a_0 + 308a_1 + 1634a_2$."
    }
  },
  "exponential-fit": {
    id: "exponential-fit",
    name: "Exponential Fit",
    category: "curve-fitting",
    definition: "Fits a curve of the form $y = ax^b$ by taking the logarithm of both sides, turning it into a linear fit problem in $\\ln x$ and $\\ln y$.",
    formula: "\\ln y = \\ln a + b \\ln x",
    algorithm: [
      "Take the natural log of both sides: $\\ln y = \\ln a + b \\ln x$.",
      "Substitute $Y = \\ln y$, $A = \\ln a$, $X = \\ln x$, turning the equation into the linear form $Y = A + bX$.",
      "Apply the Linear Fit normal equations to the transformed data: $\\sum Y = nA + b\\sum X$, $\\sum XY = A\\sum X + b\\sum X^2$.",
      "Solve for $A$ and $b$, then recover $a = e^A$."
    ],
    conditions: [
      "Requires $x > 0$ and $y > 0$ (since the logarithm is undefined for non-positive values)."
    ],
    useCases: [
      "Fitting power-law relationships $y = ax^b$, common in growth/decay and scaling-law data."
    ],
    example: {
      problem: "Fit $y = ax^b$ to a set of positive $(x, y)$ data points.",
      solution: "Transform to $Y = \\ln y$, $X = \\ln x$, fit the line $Y = A + bX$ via the normal equations, then $a = e^A$."
    }
  }
};
