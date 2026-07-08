"""
Generalized Newton-Raphson (for known root multiplicity) - MCSC 202

Plain Newton-Raphson slows down (becomes linear instead of quadratic)
when the root is repeated, e.g. a double root like the x=1 root of
(x-1)^2 (x+2). If you know the multiplicity m ahead of time, multiplying
the Newton step by m restores the fast quadratic convergence.
"""


def f(x):
    # (x - 1)^2 * (x + 2) has a double root at x = 1
    return (x - 1) ** 2 * (x + 2)


def df(x):
    # Derivative via product rule
    return 2 * (x - 1) * (x + 2) + (x - 1) ** 2


def generalized_newton(x0, multiplicity, tol=1e-6, max_iter=100):
    """
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
    print("=== Generalized Newton: (x-1)^2 (x+2) = 0, double root at x=1, x0=1.5 ===\n")

    rows, root = generalized_newton(1.5, multiplicity=2)

    print(f"{'iter':>4} {'x_n':>10} {'f(x_n)':>12} {'x_n+1':>10}")
    for i, x, fx, dfx, x_new in rows:
        print(f"{i:>4} {x:>10.6f} {fx:>12.6f} {x_new:>10.6f}")

    print(f"\nRoot approx {root:.6f} after {len(rows)} iterations (expected 1.0)")
