"""
Fixed Point Iteration for Systems - MCSC 202

Solves two nonlinear equations f(x,y) = 0, g(x,y) = 0 by rewriting them as
x = Phi(x,y) and y = Psi(x,y), then repeatedly plugging the previous
(x, y) into both formulas to get the next (x, y). Converges only if the
rewritten formulas are "contractive" near the root -- roughly, the
partial derivatives of Phi and Psi can't be too large.
"""


def phi(x, y):
    # From the class example: y^2 - 5y + 4 = 0, rewritten as y = (y^2 + 4) / 5
    return (y ** 2 + 4) / 5


def psi(x, y):
    # From the class example: 3yx^2 - 10x + 7 = 0, rewritten as x = (3yx^2 + 7) / 10
    return (3 * y * x ** 2 + 7) / 10


def fixed_point_system(x0, y0, tol=1e-4, max_iter=50):
    """
    x0, y0   : initial guess
    tol      : stop once both x and y change by less than this
    max_iter : safety cap on iterations

    Note: here Phi updates y and Psi updates x, matching the class
    notes' variable pairing -- always double-check which formula solves
    for which variable before wiring this up to a new problem.
    """
    x, y = x0, y0
    rows = []

    for i in range(1, max_iter + 1):
        # Compute both new values from the *old* (x, y) pair -- neither
        # update sees the other's new value this same iteration
        y_new = phi(x, y)
        x_new = psi(x, y)

        rows.append((i, x_new, y_new))

        if abs(x_new - x) < tol and abs(y_new - y) < tol:
            return rows, x_new, y_new

        x, y = x_new, y_new

    return rows, x, y


if __name__ == "__main__":
    print("=== Fixed Point Iteration (system): starting at (0, 0) ===\n")

    rows, x, y = fixed_point_system(0, 0)

    print(f"{'iter':>4} {'x':>10} {'y':>10}")
    for i, xi, yi in rows:
        print(f"{i:>4} {xi:>10.4f} {yi:>10.4f}")

    print(f"\nConverged to x approx {x:.4f}, y approx {y:.4f} (notes show x -> 1, y -> 1)")
