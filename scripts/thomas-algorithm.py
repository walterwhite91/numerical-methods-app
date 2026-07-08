"""
Thomas Algorithm - MCSC 202

A specialized, much faster version of Gaussian elimination for tridiagonal
systems -- ones where every equation only involves its own variable plus
its immediate neighbors (a common shape when discretizing 1D problems,
e.g. with the finite difference method). Runs in O(n) instead of the
O(n^3) a general solver would need.
"""


def thomas_algorithm(a, b, c, d):
    """
    a : sub-diagonal coefficients (a[0] is unused, since row 0 has no left neighbor)
    b : main diagonal coefficients
    c : super-diagonal coefficients (c[-1] is unused, last row has no right neighbor)
    d : right-hand side values
    """
    n = len(d)

    cp = [0.0] * n  # modified super-diagonal, after forward elimination
    dp = [0.0] * n  # modified right-hand side, after forward elimination

    cp[0] = c[0] / b[0]
    dp[0] = d[0] / b[0]

    # Forward sweep: eliminate the sub-diagonal, row by row
    for i in range(1, n):
        denom = b[i] - a[i] * cp[i - 1]
        if i < n - 1:
            cp[i] = c[i] / denom
        dp[i] = (d[i] - a[i] * dp[i - 1]) / denom

    # Back substitution: last row gives x directly, then work upward
    x = [0.0] * n
    x[-1] = dp[-1]
    for i in range(n - 2, -1, -1):
        x[i] = dp[i] - cp[i] * x[i + 1]

    return x


def read_tridiagonal_system():
    n_in = input("Enter number of equations n [Enter for a 3-equation example]: ").strip()
    if not n_in:
        # 2x0 -  x1            = 1
        # -x0 + 2x1 -  x2       = 0
        #      -x1 + 2x2       = 1
        a = [0.0, -1.0, -1.0]
        b = [2.0, 2.0, 2.0]
        c = [-1.0, -1.0, 0.0]
        d = [1.0, 0.0, 1.0]
        return a, b, c, d

    n = int(n_in)
    print("Enter each diagonal as space-separated numbers (use 0 for unused end entries):")
    a = [float(v) for v in input(f"  sub-diagonal a ({n} values): ").strip().split()]
    b = [float(v) for v in input(f"  main diagonal b ({n} values): ").strip().split()]
    c = [float(v) for v in input(f"  super-diagonal c ({n} values): ").strip().split()]
    d = [float(v) for v in input(f"  right-hand side d ({n} values): ").strip().split()]
    return a, b, c, d


if __name__ == "__main__":
    print("=== Thomas Algorithm ===")
    a, b, c, d = read_tridiagonal_system()

    x = thomas_algorithm(a, b, c, d)

    print(f"\nSolution: x = {[round(v, 4) for v in x]}")
