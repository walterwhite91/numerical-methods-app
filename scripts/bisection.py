"""
Bisection Method - MCSC 202

Finds a root of f(x) = 0 inside an interval [a, b] by repeatedly cutting
the interval in half and keeping whichever half still contains the root.
"""

import math  # only used for the iteration-count estimate at the bottom


def f(x):
    # The example function from class: f(x) = x^3 - x - 1
    return x ** 3 - x - 1


def bisection(a, b, tol=1e-4, max_iter=100):
    """
    Run the Bisection Method on f(x) over [a, b].

    a, b     : interval endpoints; f(a) and f(b) must have opposite signs
    tol      : stop once the interval half-width is smaller than this
    max_iter : safety cap so the loop can't run forever

    Returns (rows, root) where rows is a list of per-iteration values
    (for printing as a table) and root is the final estimate.
    """
    fa = f(a)
    fb = f(b)

    # Intermediate Value Theorem: a sign change between f(a) and f(b)
    # guarantees at least one root lies inside [a, b]
    if fa * fb >= 0:
        raise ValueError("f(a) and f(b) must have opposite signs.")

    rows = []  # keep every iteration so we can print a table afterward

    for i in range(1, max_iter + 1):
        c = (a + b) / 2.0  # midpoint of the current interval
        fc = f(c)          # function value at the midpoint

        rows.append((i, a, b, c, fc))

        # Stop once the interval is small enough, or c is an exact root
        if abs(b - a) / 2.0 < tol or fc == 0:
            return rows, c

        # Keep whichever half-interval still brackets the root
        if fa * fc < 0:
            b = c    # root is between a and c, so shrink b down to c
        else:
            a = c    # root is between c and b, so shrink a up to c
            fa = fc  # fa must be refreshed to match the new a

    # Ran out of iterations before hitting tolerance; return best guess
    return rows, (a + b) / 2.0


def iterations_needed(a, b, decimal_places):
    # From the notes: n >= ln((b - a) / (5 * 10^-N))
    # Estimates how many iterations are needed for N correct decimal places
    return math.log((b - a) / (5 * 10 ** -decimal_places))


if __name__ == "__main__":
    print("=== Bisection Method: f(x) = x^3 - x - 1 on [1, 2] ===\n")

    rows, root = bisection(1, 2, tol=1e-4)

    print(f"{'iter':>4} {'a':>10} {'b':>10} {'c (mid)':>10} {'f(c)':>12}")
    for i, a, b, c, fc in rows:
        print(f"{i:>4} {a:>10.6f} {b:>10.6f} {c:>10.6f} {fc:>12.6f}")

    print(f"\nRoot approx {root:.6f} after {len(rows)} iterations (expected approx 1.3247)")
    print(f"Notes formula estimate for 4 decimal places: n approx {iterations_needed(1, 2, 4):.2f} iterations")
