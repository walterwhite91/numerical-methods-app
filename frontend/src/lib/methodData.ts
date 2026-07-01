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
}

export const categories = [
  { id: "error-detection", name: "Detection of Error" },
  { id: "root-finding", name: "Roots of Equations" },
  { id: "linear-systems", name: "Matrix Operations" },
  { id: "finite-differences", name: "Finite Difference Method" },
  { id: "ode", name: "Ordinary Differential Equations (IVP)" },
  { id: "integration", name: "Numerical Integration" },
  { id: "nonlinear-systems", name: "System of Nonlinear Equations" }
];

export const methodsData: Record<string, MethodInfo> = {
  // Detection of Error
  "absolute-relative-error": {
    id: "absolute-relative-error",
    name: "Absolute & Relative Error",
    category: "error-detection",
    definition: "Fundamental measures to quantify how far an approximate computed value is from the true exact value.",
    formula: "E_a = |X - X_a|, \\quad E_r = \\left| \\frac{X - X_a}{X} \\right|",
    algorithm: [
      "Identify the true exact value $X$.",
      "Identify the approximate computed value $X_a$.",
      "Calculate Absolute Error $E_a = |X - X_a|$.",
      "Calculate Relative Error $E_r = \\left| \\frac{X - X_a}{X} \\right|$.",
      "Calculate Percentage Error $E_p = E_r \\times 100\\%$."
    ],
    conditions: [
      "True value $X$ must be non-zero to calculate Relative Error."
    ],
    useCases: [
      "Evaluating the accuracy of a numerical approximation.",
      "Determining convergence criteria in iterative numerical methods."
    ],
    example: {
      problem: "Find absolute and relative error if true value $X = 3.141592$ is approximated by $X_a = 3.14$.",
      solution: "$E_a = 0.001592$, $E_r = 0.0005067$, $E_p = 0.05067\\%$."
    }
  },
  "truncation-error": {
    id: "truncation-error",
    name: "Truncation Error (Taylor Series)",
    category: "error-detection",
    definition: "The error made by truncating an infinite mathematical process, such as a Taylor series expansion, to a finite number of terms.",
    formula: "R_n(x) = \\frac{f^{(n)}(\\xi)}{n!} (x - a)^n",
    algorithm: [
      "Identify the function $f(x)$ and the expansion point $a$.",
      "Determine the number of terms $n$ to retain.",
      "Calculate the maximum value of the $n$-th derivative $f^{(n)}(\\xi)$ in the interval $[a, x]$.",
      "Compute the truncation error bound using the remainder term formula."
    ],
    conditions: [
      "Function must be $n$-times continuously differentiable."
    ],
    useCases: [
      "Estimating the error when replacing a function with a polynomial approximation.",
      "Choosing step sizes in numerical methods (like ODE solvers) to maintain desired accuracy."
    ],
    example: {
      problem: "Estimate truncation error of $e^x$ at $x=0.1$ using a 3-term Maclaurin series ($a=0$).",
      solution: "Error bound is roughly $\\frac{e^{0.1}}{6} (0.1)^3 \\approx 0.000184$."
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
      "$f(a) \\cdot f(b) < 0$ (Intermediate Value Theorem)."
    ],
    useCases: [
      "Finding single real roots of continuous functions.",
      "Initializing bounds for faster methods like Newton-Raphson."
    ],
    example: {
      problem: "Find a root of $f(x) = x^3 - x - 1$ in $[1, 2]$ with tolerance $10^{-4}$.",
      solution: "The root converges to approximately $1.3247$ after 14 iterations."
    }
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
    }
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
    }
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
    }
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
    }
  },
  "newton-system": {
    id: "newton-system",
    name: "Newton-Raphson for Systems",
    category: "nonlinear-systems",
    definition: "Solves systems of equations using Jacobian matrix updates.",
    formula: "\\vec{x}^{(k+1)} = \\vec{x}^{(k)} - [J(\\vec{x}^{(k)})]^{-1} \\vec{F}(\\vec{x}^{(k)})",
    algorithm: [
      "Define $\\vec{F}(\\vec{x}) = 0$.",
      "Find Jacobian matrix $J(\\vec{x})$.",
      "Solve system of linear equations $J \\vec{d} = -\\vec{F}$.",
      "Update variable vector $\\vec{x} = \\vec{x} + \\vec{d}$ and repeat."
    ],
    conditions: [
      "Jacobian matrix must be non-singular."
    ],
    useCases: [
      "Solving complex non-linear systems."
    ],
    example: {
      problem: "Solve $x^2 + y^2 = 4$, $e^x + y = 1$.",
      solution: "Converges using linear system solvers per iteration."
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  }
};
