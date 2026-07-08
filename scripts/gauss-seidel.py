"""
Gauss-Seidel Iteration - MCSC 202

Almost identical to Gauss-Jacobi, but with one change that makes a big
difference: as soon as a new value is computed, use it immediately for
the rest of that same iteration instead of waiting for the next round.
That "use it as soon as you have it" trick usually makes Gauss-Seidel
converge noticeably faster than Jacobi on the same system.
"""


def gauss_seidel(x0, tol=1e-4, max_iter=30):
    """
    x0       : initial guess, a list [x, y, z]
    tol      : stop once every variable changes by less than this
    max_iter : safety cap on iterations

    Same system as the Gauss-Jacobi script:
      x = (1 + y) / 2
      y = (8 + x + z) / 3
      z = (-5 + y) / 2
    """
    x, y, z = x0
    rows = [(0, x, y, z)]

    for i in range(1, max_iter + 1):
        x_old, y_old, z_old = x, y, z

        # Each line below uses the most recently updated values available --
        # x_new already feeds into the y update on the very same iteration
        x = (1 + y) / 2
        y = (8 + x + z) / 3
        z = (-5 + y) / 2

        rows.append((i, x, y, z))

        if abs(x - x_old) < tol and abs(y - y_old) < tol and abs(z - z_old) < tol:
            return rows, (x, y, z)

    return rows, (x, y, z)


if __name__ == "__main__":
    print("=== Gauss-Seidel: starting at (0, 0, 0) ===\n")

    rows, (x, y, z) = gauss_seidel([0.0, 0.0, 0.0])

    print(f"{'iter':>4} {'x':>8} {'y':>8} {'z':>8}")
    for i, xi, yi, zi in rows:
        print(f"{i:>4} {xi:>8.4f} {yi:>8.4f} {zi:>8.4f}")

    print(f"\nConverged to x approx {x:.4f}, y approx {y:.4f}, z approx {z:.4f} (expected: 2, 3, -1)")
    print(f"Took {len(rows) - 1} iterations here vs Gauss-Jacobi's slower convergence on the same system.")
