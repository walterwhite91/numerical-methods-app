"""
Stirling's Interpolation Formula - MCSC 202

Averages the Gauss Forward and Gauss Backward formulas together, giving a
symmetric formula centered on y0. Most accurate when the target x is very
close to the middle of the table.
"""

import math


def forward_difference_table(y):
    n = len(y)
    table = [[0.0 for _ in range(n)] for _ in range(n)]
    for i in range(n):
        table[i][0] = y[i]
    for j in range(1, n):
        for i in range(n - j):
            table[i][j] = table[i + 1][j - 1] - table[i][j - 1]
    return table


def stirling_interpolation(x, y, target):
    n = len(x)
    h = x[1] - x[0]
    table = forward_difference_table(y)

    # Find the origin row closest to the target
    origin_idx = min(range(n), key=lambda i: abs(x[i] - target))
    x0 = x[origin_idx]
    p = (target - x0) / h

    result = table[origin_idx][0]  # start with y0

    for k in range(1, n):
        if k % 2 == 1:
            # Odd order k = 2m+1: average the two differences straddling y0
            m = k // 2
            row1 = origin_idx - m
            row2 = origin_idx - m - 1
            if row1 < 0 or row2 < 0 or row1 + k >= n or row2 + k >= n:
                break

            coeff = p
            for i in range(1, m + 1):
                coeff *= (p ** 2 - i ** 2)
            coeff /= math.factorial(k)

            avg_diff = (table[row1][k] + table[row2][k]) / 2.0
            result += coeff * avg_diff
        else:
            # Even order k = 2m: single centered difference, no averaging needed
            m = k // 2
            row = origin_idx - m
            if row < 0 or row + k >= n:
                break

            coeff = p ** 2
            for i in range(1, m):
                coeff *= (p ** 2 - i ** 2)
            coeff /= math.factorial(k)

            result += coeff * table[row][k]

    return table, result, origin_idx, p


def read_table():
    n_in = input("Enter number of data points [Enter for the notes' cos(x) example]: ").strip()
    if not n_in:
        # From the notes: cos(x) at x = 0.10, 0.15, 0.20, 0.25, 0.30
        return [0.10, 0.15, 0.20, 0.25, 0.30], [0.9950, 0.9888, 0.9801, 0.9689, 0.9553]

    n = int(n_in)
    x = [float(v) for v in input(f"Enter {n} x-values (space separated, equally spaced): ").strip().split()]
    y = [float(v) for v in input(f"Enter {n} y-values (space separated): ").strip().split()]
    return x, y


if __name__ == "__main__":
    print("=== Stirling's Interpolation Formula ===")
    x_vals, y_vals = read_table()

    target_in = input("Enter target x, near the middle of the table [Enter for 0.17]: ").strip()
    target = float(target_in) if target_in else 0.17

    table, result, origin_idx, p = stirling_interpolation(x_vals, y_vals, target)

    print(f"\nOrigin y0 = table row {origin_idx} (x0 = {x_vals[origin_idx]}), p = {p:.4f}")
    print(f"Interpolated y at x = {target}: {result:.6f}")
