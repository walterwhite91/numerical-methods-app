"""
Secant Method - MCSC 202

Like Newton-Raphson but doesn't need a derivative. Instead it approximates
the slope using the last two guesses (a secant line through them) and
jumps to where that secant crosses zero. Slightly slower than
Newton-Raphson but handy when f'(x) is hard or impossible to compute.
"""

import math


def make_function(expr):
    """Turns a typed expression like "x**3 - x - 1" into a callable f(x)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x})

    return f


def secant(f, x0, x1, tol=1e-6, max_iter=100):
    """
    f        : the function to find a root of, as a callable f(x)
    x0, x1   : two initial guesses (don't need to bracket the root)
    tol      : stop once successive guesses differ by less than this
    max_iter : safety cap on iterations
    """
    rows = []

    for i in range(1, max_iter + 1):
        f0 = f(x0)
        f1 = f(x1)

        if f1 - f0 == 0:
            raise ValueError("f(x1) == f(x0); secant slope is undefined.")

        # Secant formula: x-intercept of the line through (x0, f0) and (x1, f1)
        x2 = x1 - f1 * (x1 - x0) / (f1 - f0)

        rows.append((i, x0, x1, x2, f1))

        if abs(x2 - x1) < tol:
            return rows, x2

        # Slide the window forward: drop x0, keep x1 and the new point
        x0 = x1
        x1 = x2

    return rows, x1


if __name__ == "__main__":
    print("=== Secant Method ===")
    expr = input("Enter f(x), e.g. x**3 - x - 1 [Enter to use that example]: ").strip() or "x**3 - x - 1"
    f = make_function(expr)

    x0_in = input("Enter x0 [Enter for 1]: ").strip()
    x0 = float(x0_in) if x0_in else 1.0
    x1_in = input("Enter x1 [Enter for 2]: ").strip()
    x1 = float(x1_in) if x1_in else 2.0
    tol_in = input("Enter tolerance [Enter for 1e-6]: ").strip()
    tol = float(tol_in) if tol_in else 1e-6

    print(f"\n=== Solving f(x) = {expr},  x0 = {x0}, x1 = {x1} ===\n")

    rows, root = secant(f, x0, x1, tol=tol)

    print(f"{'iter':>4} {'x_prev':>10} {'x_curr':>10} {'x_next':>10} {'f(x_curr)':>12}")
    for i, xp, xc, xn, fc in rows:
        print(f"{i:>4} {xp:>10.6f} {xc:>10.6f} {xn:>10.6f} {fc:>12.6f}")

    print(f"\nRoot approx {root:.6f} after {len(rows)} iterations")
