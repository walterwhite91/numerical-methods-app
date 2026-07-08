"""
Newton-Raphson Method - MCSC 202

Uses the tangent line at the current guess to jump to the next guess.
Needs the derivative f'(x), but converges much faster than bisection or
false position when the starting guess is reasonably close to the root
(quadratic convergence: roughly doubles the number of correct digits
every iteration).
"""

import math


def make_function(expr):
    """Turns a typed expression like "x**3 - x - 1" into a callable f(x)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x})

    return f


def newton_raphson(f, df, x0, tol=1e-6, max_iter=100):
    """
    f, df    : the function and its derivative, as callables f(x), df(x)
    x0       : initial guess
    tol      : stop once successive guesses differ by less than this
    max_iter : safety cap on iterations
    """
    x = x0
    rows = []

    for i in range(1, max_iter + 1):
        fx = f(x)
        dfx = df(x)

        if dfx == 0:
            raise ValueError("Derivative is zero; Newton-Raphson can't continue.")

        # Tangent-line formula: move to where the tangent at x crosses zero
        x_new = x - fx / dfx

        rows.append((i, x, fx, dfx, x_new))

        if abs(x_new - x) < tol:
            return rows, x_new

        x = x_new

    return rows, x


if __name__ == "__main__":
    print("=== Newton-Raphson Method ===")
    expr = input("Enter f(x), e.g. x**3 - x - 1 [Enter to use that example]: ").strip() or "x**3 - x - 1"
    dexpr = input("Enter f'(x), e.g. 3*x**2 - 1 [Enter to use that example]: ").strip() or "3*x**2 - 1"
    f = make_function(expr)
    df = make_function(dexpr)

    x0_in = input("Enter initial guess x0 [Enter for 1.5]: ").strip()
    x0 = float(x0_in) if x0_in else 1.5
    tol_in = input("Enter tolerance [Enter for 1e-6]: ").strip()
    tol = float(tol_in) if tol_in else 1e-6

    print(f"\n=== Solving f(x) = {expr},  f'(x) = {dexpr},  x0 = {x0} ===\n")

    rows, root = newton_raphson(f, df, x0, tol=tol)

    print(f"{'iter':>4} {'x_n':>10} {'f(x_n)':>12} {'df(x_n)':>12} {'x_n+1':>10}")
    for i, x, fx, dfx, x_new in rows:
        print(f"{i:>4} {x:>10.6f} {fx:>12.6f} {dfx:>12.6f} {x_new:>10.6f}")

    print(f"\nRoot approx {root:.6f} after {len(rows)} iterations")
