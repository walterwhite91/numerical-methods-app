"""
Generalized Newton-Raphson (for known root multiplicity) - MCSC 202

Plain Newton-Raphson slows down (becomes linear instead of quadratic)
when the root is repeated, e.g. a double root like the x=1 root of
(x-1)^2 (x+2). If you know the multiplicity m ahead of time, multiplying
the Newton step by m restores the fast quadratic convergence.
"""

import math


def make_function(expr):
    """Turns a typed expression like "(x-1)**2 * (x+2)" into a callable f(x)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x})

    return f


def generalized_newton(f, df, x0, multiplicity, tol=1e-6, max_iter=100):
    """
    f, df        : the function and its derivative, as callables f(x), df(x)
    x0           : initial guess
    multiplicity : known multiplicity m of the target root
    tol          : stop once successive guesses differ by less than this
    max_iter     : safety cap on iterations
    """
    x = x0
    rows = []

    for i in range(1, max_iter + 1):
        fx = f(x)
        dfx = df(x)

        if dfx == 0:
            raise ValueError("Derivative is zero; can't continue.")

        # Same as Newton-Raphson, but the step is scaled by the multiplicity m
        x_new = x - multiplicity * fx / dfx

        rows.append((i, x, fx, dfx, x_new))

        if abs(x_new - x) < tol:
            return rows, x_new

        x = x_new

    return rows, x


if __name__ == "__main__":
    print("=== Generalized Newton-Raphson ===")
    expr = input("Enter f(x), e.g. (x-1)**2 * (x+2) [Enter to use that example]: ").strip() or "(x-1)**2 * (x+2)"
    dexpr = input("Enter f'(x), e.g. 2*(x-1)*(x+2) + (x-1)**2 [Enter to use that example]: ").strip() \
        or "2*(x-1)*(x+2) + (x-1)**2"
    f = make_function(expr)
    df = make_function(dexpr)

    x0_in = input("Enter initial guess x0 [Enter for 1.5]: ").strip()
    x0 = float(x0_in) if x0_in else 1.5
    m_in = input("Enter known root multiplicity m [Enter for 2]: ").strip()
    m = int(m_in) if m_in else 2
    tol_in = input("Enter tolerance [Enter for 1e-6]: ").strip()
    tol = float(tol_in) if tol_in else 1e-6

    print(f"\n=== Solving f(x) = {expr},  x0 = {x0},  m = {m} ===\n")

    rows, root = generalized_newton(f, df, x0, m, tol=tol)

    print(f"{'iter':>4} {'x_n':>10} {'f(x_n)':>12} {'x_n+1':>10}")
    for i, x, fx, dfx, x_new in rows:
        print(f"{i:>4} {x:>10.6f} {fx:>12.6f} {x_new:>10.6f}")

    print(f"\nRoot approx {root:.6f} after {len(rows)} iterations")
