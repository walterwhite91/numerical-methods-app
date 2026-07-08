"""
Gauss Forward Interpolation - MCSC 202

A central-difference interpolation formula: instead of anchoring at the
very first or very last row of the table (like the Newton forward/backward
formulas), it anchors at a row near the *middle* of the table, y0, and
mixes forward and backward-looking differences around it. Best used when
the target x is in the first half of the interval just past x0.
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


def gauss_forward_interpolation(x, y, target):
    n = len(x)
    h = x[1] - x[0]
    table = forward_difference_table(y)

    # Pick the origin row y0 as the table point just at or before the target
    origin_idx = int((target - x[0]) / h)
    p = (target - x[origin_idx]) / h

    result = table[origin_idx][0]  # start with y0
    term = 1.0
    factorial = 1

    for k in range(1, n):
        # Builds the alternating p, (p-1), (p+1), (p-2), (p+2), ... product
        # that appears in the Gauss Forward formula term by term
        if k == 1:
            factor = p
        elif k % 2 == 0:
            factor = p - k // 2
        else:
            factor = p + (k - 1) // 2
        term *= factor
        factorial *= k

        # Row alternates between y0 and increasingly earlier rows as k grows
        row = origin_idx - k // 2
        if row < 0 or row + k >= n:
            break  # ran out of table entries for this order

        result += (term / factorial) * table[row][k]

    return table, result, origin_idx, p


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
    print("=== Gauss Forward Interpolation ===")
    x_vals, y_vals = read_table()

    target_in = input("Enter target x, just past a middle table point [Enter for 2.25]: ").strip()
    target = float(target_in) if target_in else 2.25

    table, result, origin_idx, p = gauss_forward_interpolation(x_vals, y_vals, target)

    print(f"\nOrigin y0 = table row {origin_idx} (x0 = {x_vals[origin_idx]}), p = {p:.4f}")
    print(f"Interpolated y at x = {target}: {result:.4f}")
