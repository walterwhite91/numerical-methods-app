"""
Newton-Raphson Method - MCSC 202

Uses the tangent line at the current guess to jump to the next guess.
Needs the derivative f'(x), but converges much faster than bisection or
false position when the starting guess is reasonably close to the root
(quadratic convergence: roughly doubles the number of correct digits
every iteration).
"""


def f(x):
    return x ** 3 - x - 1


def df(x):
    # Derivative of x^3 - x - 1
    return 3 * x ** 2 - 1


def newton_raphson(x0, tol=1e-6, max_iter=100):
    """
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
    print("=== Newton-Raphson: f(x) = x^3 - x - 1, x0 = 1.5 ===\n")

    rows, root = newton_raphson(1.5)

    print(f"{'iter':>4} {'x_n':>10} {'f(x_n)':>12} {'df(x_n)':>12} {'x_n+1':>10}")
    for i, x, fx, dfx, x_new in rows:
        print(f"{i:>4} {x:>10.6f} {fx:>12.6f} {dfx:>12.6f} {x_new:>10.6f}")

    print(f"\nRoot approx {root:.6f} after {len(rows)} iterations (expected approx 1.3247)")
