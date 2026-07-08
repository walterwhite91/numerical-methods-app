"""
Simpson's 3/8 Rule - MCSC 202

Same spirit as Simpson's 1/3 Rule, but fits a cubic curve through every
group of 4 consecutive points instead of a parabola through 3. That
means n must be a multiple of 3. Slightly different weighting pattern
(3, 3, 2, 3, 3, 2, ...) but similar accuracy to the 1/3 rule.
"""

import math


def make_function(expr):
    """Turns a typed expression like "x**2" into a callable f(x)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x})

    return f


def simpson_38(f, a, b, n):
    """
    f    : the function to integrate, as a callable f(x)
    a, b : integration limits
    n    : number of subintervals; must be a multiple of 3
    """
    if n % 3 != 0:
        raise ValueError("Simpson's 3/8 rule requires n to be a multiple of 3.")

    h = (b - a) / n
    y = [f(a + i * h) for i in range(n + 1)]

    # Points at multiples of 3 get weight 2, all other interior points get weight 3
    sum_mult3 = sum(y[i] for i in range(3, n, 3))
    sum_rest = sum(y[i] for i in range(1, n) if i % 3 != 0)

    integral = (3 * h / 8) * (y[0] + y[-1] + 3 * sum_rest + 2 * sum_mult3)

    return integral, y, h


if __name__ == "__main__":
    print("=== Simpson's 3/8 Rule ===")
    expr = input("Enter f(x), e.g. x**2 [Enter to use that example]: ").strip() or "x**2"
    f = make_function(expr)

    a_in = input("Enter lower limit a [Enter for 0]: ").strip()
    a = float(a_in) if a_in else 0.0
    b_in = input("Enter upper limit b [Enter for 1]: ").strip()
    b = float(b_in) if b_in else 1.0
    n_in = input("Enter number of subintervals n, must be a multiple of 3 [Enter for 3]: ").strip()
    n = int(n_in) if n_in else 3

    print(f"\n=== Integrating f(x) = {expr}  from {a} to {b},  n = {n} ===\n")

    integral, y, h = simpson_38(f, a, b, n)

    print(f"h = {h}")
    print("y values:", [round(v, 4) for v in y])
    print(f"\nIntegral approx {integral:.5f}")
