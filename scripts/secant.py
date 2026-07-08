"""
Secant Method - MCSC 202

Like Newton-Raphson but doesn't need a derivative. Instead it approximates
the slope using the last two guesses (a secant line through them) and
jumps to where that secant crosses zero. Slightly slower than
Newton-Raphson but handy when f'(x) is hard or impossible to compute.
"""


def f(x):
    return x ** 3 - x - 1


def secant(x0, x1, tol=1e-6, max_iter=100):
    """
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
    print("=== Secant Method: f(x) = x^3 - x - 1, x0=1, x1=2 ===\n")

    rows, root = secant(1, 2)

    print(f"{'iter':>4} {'x_prev':>10} {'x_curr':>10} {'x_next':>10} {'f(x_curr)':>12}")
    for i, x0, x1, x2, f1 in rows:
        print(f"{i:>4} {x0:>10.6f} {x1:>10.6f} {x2:>10.6f} {f1:>12.6f}")

    print(f"\nRoot approx {root:.6f} after {len(rows)} iterations (expected approx 1.3247)")
