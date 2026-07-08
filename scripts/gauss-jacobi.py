"""
Gauss-Jacobi Iteration - MCSC 202

Solves Ax = b iteratively: rearrange each equation to solve for its own
variable, then repeatedly plug in the *previous* full set of values to
get the *next* full set, all at once. Needs the matrix to be diagonally
dominant (each diagonal entry bigger in magnitude than the rest of its
row) to be guaranteed to converge.
"""


def gauss_jacobi(x0, tol=1e-4, max_iter=30):
    """
    x0       : initial guess, a list [x, y, z]
    tol      : stop once every variable changes by less than this
    max_iter : safety cap on iterations

    System (from the notes), each equation solved for its own variable:
      2x - y = 1        ->  x = (1 + y) / 2
      -x + 3y - z = 8    ->  y = (8 + x + z) / 3
      -y + 2z = -5       ->  z = (-5 + y) / 2
    """
    x, y, z = x0
    rows = [(0, x, y, z)]

    for i in range(1, max_iter + 1):
        # Every new value uses only the OLD (x, y, z) -- that's what makes
        # this Jacobi rather than Gauss-Seidel
        x_new = (1 + y) / 2
        y_new = (8 + x + z) / 3
        z_new = (-5 + y) / 2

        rows.append((i, x_new, y_new, z_new))

        if abs(x_new - x) < tol and abs(y_new - y) < tol and abs(z_new - z) < tol:
            return rows, (x_new, y_new, z_new)

        x, y, z = x_new, y_new, z_new

    return rows, (x, y, z)


if __name__ == "__main__":
    print("=== Gauss-Jacobi: starting at (0, 0, 0) ===\n")

    rows, (x, y, z) = gauss_jacobi([0.0, 0.0, 0.0])

    print(f"{'iter':>4} {'x':>8} {'y':>8} {'z':>8}")
    for i, xi, yi, zi in rows:
        print(f"{i:>4} {xi:>8.4f} {yi:>8.4f} {zi:>8.4f}")

    print(f"\nConverged to x approx {x:.4f}, y approx {y:.4f}, z approx {z:.4f} (expected: 2, 3, -1)")
