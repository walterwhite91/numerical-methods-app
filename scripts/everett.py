"""
Everett's Interpolation Formula - MCSC 202

Uses only even-order differences (skips odd orders entirely), combining
contributions from two adjacent origins y0 and y1. Extensively used in
practice and considered one of the most reliable central-difference
formulas -- your notes specifically flag this as heavily emphasized.
"""


def forward_difference_table(y):
    n = len(y)
    table = [[0.0 for _ in range(n)] for _ in range(n)]
    for i in range(n):
        table[i][0] = y[i]
    for j in range(1, n):
        for i in range(n - j):
            table[i][j] = table[i + 1][j - 1] - table[i][j - 1]
    return table


def everett_interpolation(x, y, target):
    n = len(x)
    h = x[1] - x[0]
    table = forward_difference_table(y)

    origin_idx = int((target - x[0]) / h)  # x0, left endpoint of [x0, x1]
    p = (target - x[origin_idx]) / h
    q = 1 - p

    y0 = table[origin_idx][0]
    y1 = table[origin_idx + 1][0] if origin_idx + 1 < n else y0

    result = q * y0 + p * y1  # the two base (zero-order) terms

    # Add even-order terms (k = 2, 4, 6, ...) from both sides independently --
    # a table too small for one side's term at a given order shouldn't stop
    # the other side's (still valid) term from being included.
    for m in range(1, n):
        k = 2 * m  # only even orders

        fact = 1
        for i in range(1, k + 2):
            fact *= i  # (k+1)!

        row_q = origin_idx - m  # row for the q-side term (Dk y_{-m})
        if row_q >= 0 and row_q + k < n:
            q_coeff = q
            for i in range(1, m + 1):
                q_coeff *= (q ** 2 - i ** 2)
            q_coeff /= fact
            result += q_coeff * table[row_q][k]

        row_p = origin_idx - (m - 1)  # row for the p-side term (Dk y_{-(m-1)})
        if row_p >= 0 and row_p + k < n:
            p_coeff = p
            for i in range(1, m + 1):
                p_coeff *= (p ** 2 - i ** 2)
            p_coeff /= fact
            result += p_coeff * table[row_p][k]

        if row_q < 0 and row_p < 0:
            break  # both sides have run out of table entries entirely

    return table, result, origin_idx, p, q


def read_table():
    n_in = input("Enter number of data points [Enter for the example x=[0,1,2,3,4], y=x^2]: ").strip()
    if not n_in:
        x = [0.0, 1.0, 2.0, 3.0, 4.0]
        return x, [v ** 2 for v in x]

    n = int(n_in)
    x = [float(v) for v in input(f"Enter {n} x-values (space separated, equally spaced): ").strip().split()]
    y = [float(v) for v in input(f"Enter {n} y-values (space separated): ").strip().split()]
    return x, y


if __name__ == "__main__":
    print("=== Everett's Interpolation Formula ===")
    x_vals, y_vals = read_table()

    target_in = input("Enter target x between two table points [Enter for 2.5]: ").strip()
    target = float(target_in) if target_in else 2.5

    table, result, origin_idx, p, q = everett_interpolation(x_vals, y_vals, target)

    print(f"\nx0 = {x_vals[origin_idx]}, p = {p:.4f}, q = {q:.4f}")
    print(f"Interpolated y at x = {target}: {result:.4f}")
