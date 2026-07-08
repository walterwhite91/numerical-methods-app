"""
LU Decomposition - MCSC 202

Solves Ax = b by first factoring the matrix A into a lower-triangular L
and an upper-triangular U, so that A = LU. Once you have L and U, solving
the system is two easy triangular solves instead of one hard general
solve: first Ly = b (forward substitution), then Ux = y (backward
substitution).
"""


def lu_decompose(A):
    n = len(A)

    # L starts as the identity matrix (1s on the diagonal)
    L = [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]
    # U starts as all zeros and gets filled in row by row
    U = [[0.0 for _ in range(n)] for _ in range(n)]

    for i in range(n):
        # Row i of U: subtract off what's already accounted for by L and U
        for k in range(i, n):
            total = sum(L[i][j] * U[j][k] for j in range(i))
            U[i][k] = A[i][k] - total

        # Column i of L (below the diagonal): same idea, then divide by the pivot U[i][i]
        for k in range(i + 1, n):
            total = sum(L[k][j] * U[j][i] for j in range(i))
            L[k][i] = (A[k][i] - total) / U[i][i]

    return L, U


def forward_substitution(L, b):
    n = len(b)
    y = [0.0] * n
    for i in range(n):
        # y[i] = b[i] minus whatever the earlier y's already contribute
        total = sum(L[i][j] * y[j] for j in range(i))
        y[i] = b[i] - total
    return y


def backward_substitution(U, y):
    n = len(y)
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        # x[i] = (y[i] minus whatever the later x's already contribute) / pivot
        total = sum(U[i][j] * x[j] for j in range(i + 1, n))
        x[i] = (y[i] - total) / U[i][i]
    return x


def solve(A, b):
    L, U = lu_decompose(A)
    y = forward_substitution(L, b)   # Step 1: solve Ly = b
    x = backward_substitution(U, y)  # Step 2: solve Ux = y
    return L, U, x


if __name__ == "__main__":
    print("=== LU Decomposition: notes' 3x3 system ===\n")

    # From the notes: 2x + 3y + z = 9, x + 2y + 3z = 6, 3x + y + 2z = 8
    A = [[2.0, 3.0, 1.0],
         [1.0, 2.0, 3.0],
         [3.0, 1.0, 2.0]]
    b = [9.0, 6.0, 8.0]

    L, U, x = solve(A, b)

    print("L:")
    for row in L:
        print(" ", [round(v, 4) for v in row])
    print("U:")
    for row in U:
        print(" ", [round(v, 4) for v in row])

    print(f"\nSolution: x = {x[0]:.4f}, y = {x[1]:.4f}, z = {x[2]:.4f}")
