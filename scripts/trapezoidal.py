"""
Trapezoidal Rule - MCSC 202

Approximates a definite integral by slicing [a, b] into n strips and
treating the top of each strip as a straight line (a trapezoid) instead
of following the curve exactly. Simple and always usable, but less
accurate than Simpson's rules for the same number of points.
"""

import math


def make_function(expr):
    """Turns a typed expression like "x**2" into a callable f(x)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x})

    return f


def trapezoidal(f, a, b, n):
    """
    f    : the function to integrate, as a callable f(x)
    a, b : integration limits
    n    : number of subintervals (strips)
    """
    h = (b - a) / n  # width of each strip

    # Evaluate y at every x_0, x_1, ..., x_n
    y = [f(a + i * h) for i in range(n + 1)]

    # Trapezoidal formula: h/2 * [ (first + last) + 2 * (everything in between) ]
    middle_sum = sum(y[1:-1])
    integral = (h / 2) * (y[0] + y[-1] + 2 * middle_sum)

    return integral, y, h


if __name__ == "__main__":
    print("=== Trapezoidal Rule ===")
    expr = input("Enter f(x), e.g. x**2 [Enter to use that example]: ").strip() or "x**2"
    f = make_function(expr)

    a_in = input("Enter lower limit a [Enter for 0]: ").strip()
    a = float(a_in) if a_in else 0.0
    b_in = input("Enter upper limit b [Enter for 1]: ").strip()
    b = float(b_in) if b_in else 1.0
    n_in = input("Enter number of subintervals n [Enter for 4]: ").strip()
    n = int(n_in) if n_in else 4

    print(f"\n=== Integrating f(x) = {expr}  from {a} to {b},  n = {n} ===\n")

    integral, y, h = trapezoidal(f, a, b, n)

    print(f"h = {h}")
    print("y values:", [round(v, 4) for v in y])
    print(f"\nIntegral approx {integral:.5f}")
