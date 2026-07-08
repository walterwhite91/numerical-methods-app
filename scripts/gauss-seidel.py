"""
Gauss-Seidel Iteration - MCSC 202

Almost identical to Gauss-Jacobi, but with one change that makes a big
difference: as soon as a new value is computed, use it immediately for
the rest of that same iteration instead of waiting for the next round.
That "use it as soon as you have it" trick usually makes Gauss-Seidel
converge noticeably faster than Jacobi on the same system.
"""


def gauss_seidel(A, b, x0, tol=1e-4, max_iter=50):
    """
    A, b     : the system Ax = b, as a matrix (list of rows) and vector
    x0       : initial guess vector
    tol      : stop once every variable changes by less than this
    max_iter : safety cap on iterations
    """
    n = len(b)
    x = list(x0)
    rows = [(0, list(x))]

    for it in range(1, max_iter + 1):
        x_old = list(x)

        for i in range(n):
            # Same formula as Jacobi, but x[j] here may already be this
            # iteration's freshly updated value (for j < i) -- that's the
            # only difference from Gauss-Jacobi
            total = sum(A[i][j] * x[j] for j in range(n) if j != i)
            x[i] = (b[i] - total) / A[i][i]

        rows.append((it, list(x)))

        if all(abs(x[i] - x_old[i]) < tol for i in range(n)):
            return rows, x

    return rows, x


if __name__ == "__main__":
    print("=== Gauss-Seidel Iteration ===")
    n_in = input("Enter number of equations n [Enter for the notes' 3-equation example]: ").strip()

    if not n_in:
        # Same system as the Gauss-Jacobi script: 2x-y=1, -x+3y-z=8, -y+2z=-5
        A = [[2.0, -1.0, 0.0], [-1.0, 3.0, -1.0], [0.0, -1.0, 2.0]]
        b = [1.0, 8.0, -5.0]
        n = 3
    else:
        n = int(n_in)
        print(f"Enter each row of A ({n} numbers separated by spaces), one row per line:")
        A = [[float(v) for v in input(f"  row {i + 1}: ").strip().split()] for i in range(n)]
        b = [float(v) for v in input(f"Enter b ({n} numbers separated by spaces): ").strip().split()]

    x0_row = input(f"Enter initial guess x0 ({n} numbers) [Enter for all zeros]: ").strip()
    x0 = [float(v) for v in x0_row.split()] if x0_row else [0.0] * n

    print(f"\n=== Solving Ax = b starting at {x0} ===\n")

    rows, x = gauss_seidel(A, b, x0)

    header = "".join(f"x{i}".rjust(10) for i in range(len(x)))
    print(f"{'iter':>4} {header}")
    for it, xi in rows:
        values = "".join(f"{v:>10.4f}" for v in xi)
        print(f"{it:>4} {values}")

    print(f"\nConverged to x approx {[round(v, 4) for v in x]} in {len(rows) - 1} iterations")
