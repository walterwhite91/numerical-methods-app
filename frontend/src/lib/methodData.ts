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
  { id: "root-finding", name: "Root Finding" },
  { id: "nonlinear-systems", name: "System of Nonlinear Equations" },
  { id: "finite-differences", name: "Finite Differences & Interpolation" },
  { id: "ode", name: "Ordinary Differential Equations (IVP)" },
  { id: "integration", name: "Numerical Integration" },
  { id: "linear-systems", name: "Linear System of Equations" }
];

export const methodsData: Record<string, MethodInfo> = {
  // Root Finding
  "bisection": {
    id: "bisection",
    name: "Bisection Method",
    category: "root-finding",
    definition: "An incremental search method that repeatedly bisects an interval and selects a subinterval in which a root must lie for a continuous function.",
    formula: "c = \\frac{a + b}{2}",
    algorithm: [
      "Choose a and b such that f(a) and f(b) have opposite signs (f(a) * f(b) < 0).",
      "Calculate the midpoint c = (a + b) / 2.",
      "Evaluate f(c).",
      "If f(c) is close enough to 0 or interval length is below tolerance, stop.",
      "If f(a) * f(c) < 0, set b = c. Else, set a = c.",
      "Repeat steps 2-5."
    ],
    conditions: [
      "f(x) must be continuous in [a, b].",
      "f(a) * f(b) < 0 (intermediate value theorem)."
    ],
    useCases: [
      "Finding single real roots of continuous functions.",
      "Initializing bounds for faster methods."
    ],
    example: {
      problem: "Find a root of f(x) = x^3 - x - 1 in [1, 2] with tolerance 1e-4.",
      solution: "The root converges to approximately 1.3247 after 14 iterations."
    }
  },
  "secant": {
    id: "secant",
    name: "Secant Method",
    category: "root-finding",
    definition: "An iterative root-finding method that uses a succession of roots of secant lines to find increasingly better approximations of a root.",
    formula: "x_{n+1} = x_n - f(x_n) \\frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})}",
    algorithm: [
      "Choose two initial guesses x_0 and x_1.",
      "Compute x_{n+1} using the secant formula.",
      "Check error |x_{n+1} - x_n|.",
      "If error < tolerance, stop and return root.",
      "Otherwise, set x_{n-1} = x_n and x_n = x_{n+1}.",
      "Repeat."
    ],
    conditions: [
      "f(x_{n}) \\neq f(x_{n-1}) to avoid division by zero.",
      "No guarantee of convergence if initial guesses are far from root."
    ],
    useCases: [
      "Faster than bisection.",
      "Useful when computing derivatives analytically is too difficult."
    ],
    example: {
      problem: "Solve x^3 - x - 1 = 0 starting with x0 = 1, x1 = 2.",
      solution: "Root converges to 1.3247."
    }
  },
  "false-position": {
    id: "false-position",
    name: "False Position Method",
    category: "root-finding",
    definition: "Also known as Regula Falsi, it is a closed-interval root-finding method that connects f(a) and f(b) with a straight line and finds its x-intercept to estimate the root.",
    formula: "c = \\frac{a f(b) - b f(a)}{f(b) - f(a)}",
    algorithm: [
      "Choose a and b such that f(a) * f(b) < 0.",
      "Calculate the false position root estimate c.",
      "Evaluate f(c).",
      "If f(a) * f(c) < 0, set b = c. Else, set a = c.",
      "Repeat until convergence."
    ],
    conditions: [
      "f(x) must be continuous in [a, b].",
      "f(a) * f(b) < 0."
    ],
    useCases: [
      "Guaranteed convergence (unlike Secant).",
      "Usually faster than Bisection."
    ],
    example: {
      problem: "Solve x^3 - x - 1 = 0 in [1, 2].",
      solution: "Root converges to 1.3247."
    }
  },
  "newton-raphson": {
    id: "newton-raphson",
    name: "Newton-Raphson Method",
    category: "root-finding",
    definition: "An open method that uses the tangent line of the function at a current approximation to find the next approximation of the root.",
    formula: "x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}",
    algorithm: [
      "Provide an initial guess x_0.",
      "Compute x_{n+1} = x_n - f(x_n)/f'(x_n).",
      "Check error |x_{n+1} - x_n|.",
      "If error < tolerance, stop.",
      "Else, update x_n = x_{n+1} and repeat."
    ],
    conditions: [
      "f'(x) must not be zero at any point in the iteration.",
      "f(x) must be differentiable."
    ],
    useCases: [
      "Extremely fast (quadratic convergence) when close to the root."
    ],
    example: {
      problem: "Solve x^3 - x - 1 = 0 with x0 = 1.5.",
      solution: "Root converges to 1.3247."
    }
  },
  "generalized-newton": {
    id: "generalized-newton",
    name: "Generalised Newton-Raphson Method",
    category: "root-finding",
    definition: "An extension of Newton-Raphson to solve for multiple roots or roots with higher multiplicity by incorporating second derivatives.",
    formula: "x_{n+1} = x_n - \\frac{f(x_n)f'(x_n)}{(f'(x_n))^2 - f(x_n)f''(x_n)}",
    algorithm: [
      "Choose initial guess x_0.",
      "Evaluate f(x_n), f'(x_n), and f''(x_n).",
      "Update using the generalized formula.",
      "Check convergence criteria."
    ],
    conditions: [
      "Function must be twice differentiable.",
      "Denominator must not evaluate to zero."
    ],
    useCases: [
      "Accelerating convergence when dealing with multiple or repeating roots."
    ],
    example: {
      problem: "Solve x^3 - 3*x + 2 = 0 which has a double root.",
      solution: "Generalized Newton converges quadratically to 1.0."
    }
  },
  
  // Systems of Nonlinear Equations
  "iteration-system": {
    id: "iteration-system",
    name: "Fixed Point Iteration Method",
    category: "nonlinear-systems",
    definition: "Solving a system by rearranging equations into explicit iterative forms x_i = g_i(x_1, x_2, ...).",
    formula: "\\vec{x}^{(k+1)} = \\vec{g}(\\vec{x}^{(k)})",
    algorithm: [
      "Rearrange equations to isolate each variable.",
      "Provide an initial vector guess x_0.",
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
      problem: "Solve x = (x*y + 1)/2, y = (x^2 - 3)/y.",
      solution: "Evaluates step by step to find fixed points."
    }
  },
  "newton-system": {
    id: "newton-system",
    name: "Newton-Raphson for Nonlinear Systems",
    category: "nonlinear-systems",
    definition: "Solves systems of equations using Jacobian matrix updates.",
    formula: "\\vec{x}^{(k+1)} = \\vec{x}^{(k)} - [J(\\vec{x}^{(k)})]^{-1} \\vec{F}(\\vec{x}^{(k)})",
    algorithm: [
      "Define F(x) = 0.",
      "Find Jacobian matrix J(x).",
      "Solve system of linear equations J * delta = -F.",
      "Update variable vector and repeat."
    ],
    conditions: [
      "Jacobian matrix must be non-singular."
    ],
    useCases: [
      "Solving complex non-linear systems in engineering and physics."
    ],
    example: {
      problem: "Solve x^2 + y^2 = 4, e^x + y = 1.",
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
      "Determine spacing h and calculate u = (x - x_0)/h.",
      "Substitute values from the top row of the table into formula.",
      "Evaluate sum."
    ],
    conditions: [
      "Equally spaced intervals of x."
    ],
    useCases: [
      "Interpolating values near the beginning of the table."
    ],
    example: {
      problem: "Find y at x=1.5 given table: x=[1, 2, 3], y=[1, 4, 9].",
      solution: "Using Forward difference, y = 2.25."
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
      "Calculate u = (x - x_n)/h.",
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
      problem: "Find y at x=2.5 given x=[1, 2, 3], y=[1, 4, 9].",
      solution: "Using Backward difference, y = 6.25."
    }
  },

  // ODEs
  "euler": {
    id: "euler",
    name: "Euler's Method",
    category: "ode",
    definition: "A first-order numerical procedure for solving ordinary differential equations (ODEs) with a given initial value.",
    formula: "y_{n+1} = y_n + h f(x_n, y_n)",
    algorithm: [
      "Start with x_0, y_0, step size h.",
      "Calculate slope = f(x_n, y_n).",
      "Compute y_{n+1} = y_n + h * slope.",
      "Update x_{n+1} = x_n + h.",
      "Repeat."
    ],
    conditions: [
      "Requires initial condition (x0, y0)."
    ],
    useCases: [
      "Quick, basic approximation of simple differential equations."
    ],
    example: {
      problem: "Solve dy/dx = x + y with x0=0, y0=1, h=0.1 to find y(0.2).",
      solution: "Iteration 1: y(0.1) = 1.1. Iteration 2: y(0.2) = 1.22."
    }
  },
  "modified-euler": {
    id: "modified-euler",
    name: "Modified Euler Method",
    category: "ode",
    definition: "An improved predictor-corrector method that averages the slope at the current step and the predicted next step.",
    formula: "y_{n+1} = y_n + \\frac{h}{2} [ f(x_n, y_n) + f(x_{n+1}, y_{n+1}^*) ]",
    algorithm: [
      "Predict y_{n+1}^* = y_n + h f(x_n, y_n).",
      "Correct y_{n+1} using the averaged slope at x_n and predicted x_{n+1}.",
      "Repeat."
    ],
    conditions: [
      "Requires initial conditions."
    ],
    useCases: [
      "Better convergence than standard Euler."
    ],
    example: {
      problem: "Solve dy/dx = x + y with x0=0, y0=1, h=0.1.",
      solution: "Step 1: Predict y*(0.1)=1.1, Correct y(0.1)=1.11."
    }
  },
  "rk4": {
    id: "rk4",
    name: "Runge-Kutta 4th Order (RK4)",
    category: "ode",
    definition: "A widely used, highly accurate fourth-order algorithm for the numerical solution of ODEs.",
    formula: "y_{n+1} = y_n + \\frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4)",
    algorithm: [
      "Calculate k1 = h * f(x_n, y_n).",
      "Calculate k2 = h * f(x_n + h/2, y_n + k1/2).",
      "Calculate k3 = h * f(x_n + h/2, y_n + k2/2).",
      "Calculate k4 = h * f(x_n + h, y_n + k3).",
      "Update y_{n+1} = y_n + (k1 + 2k2 + 2k3 + k4)/6."
    ],
    conditions: [
      "Requires initial condition."
    ],
    useCases: [
      "Standard solver for ODEs in scientific computing."
    ],
    example: {
      problem: "Solve dy/dx = x + y with x0=0, y0=1, h=0.1.",
      solution: "Converges with high accuracy."
    }
  },

  // Integration
  "trapezoidal": {
    id: "trapezoidal",
    name: "Trapezoidal Rule",
    category: "integration",
    definition: "Approximates the area under a curve by dividing the interval into trapezoids.",
    formula: "I \\approx \\frac{h}{2} [ (y_0 + y_n) + 2 \\sum_{i=1}^{n-1} y_i ]",
    algorithm: [
      "Determine step size h = (b - a)/n.",
      "Generate table of x and y values.",
      "Apply Trapezoidal formula.",
      "Compute final integral value."
    ],
    conditions: [
      "Interval [a, b] is continuous."
    ],
    useCases: [
      "Integrating continuous functions with arbitrary interval partitions."
    ],
    example: {
      problem: "Integrate x^2 from 0 to 1 with n=4.",
      solution: "Integral value ≈ 0.34375 (Analytical value: 0.3333)"
    }
  },
  "simpson-13": {
    id: "simpson-13",
    name: "Simpson's 1/3 Rule",
    category: "integration",
    definition: "Approximates the area under a curve using parabolas over subintervals.",
    formula: "I \\approx \\frac{h}{3} [ (y_0 + y_n) + 4 \\sum_{odd} y_i + 2 \\sum_{even} y_i ]",
    algorithm: [
      "Ensure subintervals count n is even.",
      "Calculate h = (b-a)/n.",
      "Apply Simpson's 1/3 formula using odd and even indices.",
      "Calculate result."
    ],
    conditions: [
      "n must be an even integer."
    ],
    useCases: [
      "Higher precision integration than Trapezoidal."
    ],
    example: {
      problem: "Integrate x^2 from 0 to 1 with n=4.",
      solution: "Integral value = 0.33333."
    }
  },
  "simpson-38": {
    id: "simpson-38",
    name: "Simpson's 3/8 Rule",
    category: "integration",
    definition: "Approximates area using third-order polynomials over partitions.",
    formula: "I \\approx \\frac{3h}{8} [ (y_0 + y_n) + 3 \\sum_{i \\neq 3k} y_i + 2 \\sum_{i=3, 6...} y_i ]",
    algorithm: [
      "Ensure n is a multiple of 3.",
      "Compute h = (b-a)/n.",
      "Apply Simpson's 3/8 formula.",
      "Compute result."
    ],
    conditions: [
      "n must be a multiple of 3."
    ],
    useCases: [
      "Highly accurate integration, especially when matching specific sample size partitions."
    ],
    example: {
      problem: "Integrate x^2 from 0 to 1 with n=3.",
      solution: "Integral value = 0.33333."
    }
  }
};
