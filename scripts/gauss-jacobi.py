"""
Gauss-Jacobi Iteration - MCSC 202

Solves Ax = b iteratively: rearrange each equation to solve for its own
variable, then repeatedly plug in the *previous* full set of values to
get the *next* full set, all at once. Needs the matrix to be diagonally
dominant (each diagonal entry bigger in magnitude than the rest of its
row) to be guaranteed to converge.
"""


def gauss_jacobi(A, b, x0, tol=1e-4, max_iter=50):
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
        x_new = [0.0] * n

        for i in range(n):
            # x_i = (b_i - sum of a_ij * x_j for every other variable) / a_ii
            # Every value on the right comes from the OLD x -- that's what
            # makes this Jacobi rather than Gauss-Seidel
            total = sum(A[i][j] * x[j] for j in range(n) if j != i)
            x_new[i] = (b[i] - total) / A[i][i]

        rows.append((it, list(x_new)))

        if all(abs(x_new[i] - x[i]) < tol for i in range(n)):
            return rows, x_new

        x = x_new

    return rows, x


if __name__ == "__main__":
    print("=== Gauss-Jacobi Iteration ===")
    n_in = input("Enter number of equations n [Enter for the notes' 3-equation example]: ").strip()

    if not n_in:
        # From the notes: 2x - y = 1, -x + 3y - z = 8, -y + 2z = -5
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

    rows, x = gauss_jacobi(A, b, x0)

    header = "".join(f"x{i}".rjust(10) for i in range(len(x)))
    print(f"{'iter':>4} {header}")
    for it, xi in rows:
        values = "".join(f"{v:>10.4f}" for v in xi)
        print(f"{it:>4} {values}")

    print(f"\nConverged to x approx {[round(v, 4) for v in x]}")
