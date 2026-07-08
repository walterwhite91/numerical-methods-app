"""
Simpson's 1/3 Rule - MCSC 202

Also approximates a definite integral by slicing [a, b] into n strips,
but instead of straight lines (Trapezoidal), it fits a parabola through
every group of 3 consecutive points. That's why n must be even -- the
strips are processed two at a time. More accurate than the Trapezoidal
Rule for the same n.
"""

import math


def make_function(expr):
    """Turns a typed expression like "x**2" into a callable f(x)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x})

    return f


def simpson_13(f, a, b, n):
    """
    f    : the function to integrate, as a callable f(x)
    a, b : integration limits
    n    : number of subintervals; must be even
    """
    if n % 2 != 0:
        raise ValueError("Simpson's 1/3 rule requires n to be even.")

    h = (b - a) / n
    y = [f(a + i * h) for i in range(n + 1)]

    # Odd-indexed points get weight 4, even-indexed interior points get weight 2
    sum_odd = sum(y[i] for i in range(1, n, 2))
    sum_even = sum(y[i] for i in range(2, n, 2))

    integral = (h / 3) * (y[0] + y[-1] + 4 * sum_odd + 2 * sum_even)

    return integral, y, h


if __name__ == "__main__":
    print("=== Simpson's 1/3 Rule ===")
    expr = input("Enter f(x), e.g. x**2 [Enter to use that example]: ").strip() or "x**2"
    f = make_function(expr)

    a_in = input("Enter lower limit a [Enter for 0]: ").strip()
    a = float(a_in) if a_in else 0.0
    b_in = input("Enter upper limit b [Enter for 1]: ").strip()
    b = float(b_in) if b_in else 1.0
    n_in = input("Enter number of subintervals n, must be even [Enter for 4]: ").strip()
    n = int(n_in) if n_in else 4

    print(f"\n=== Integrating f(x) = {expr}  from {a} to {b},  n = {n} ===\n")

    integral, y, h = simpson_13(f, a, b, n)

    print(f"h = {h}")
    print("y values:", [round(v, 4) for v in y])
    print(f"\nIntegral approx {integral:.5f}")
