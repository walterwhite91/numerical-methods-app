"""
Gauss Backward Interpolation - MCSC 202

The companion formula to Gauss Forward: also anchored at a central row
y0, but used when the target x sits just *before* y0 instead of just
after it. Follows the same "mix of forward/backward differences around
the center" idea, just shifted.
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


def gauss_backward_interpolation(x, y, target):
    n = len(x)
    h = x[1] - x[0]
    table = forward_difference_table(y)

    # Pick the origin row y0 as the table point just at or after the target
    origin_idx = math.ceil((target - x[0]) / h)
    p = (target - x[origin_idx]) / h  # will typically be <= 0

    result = table[origin_idx][0]  # start with y0

    # Standard Gauss Backward formula, term by term, with bounds checks so
    # it degrades gracefully on a small table:
    #   y_p = y0 + p*Dy_{-1} + p(p+1)/2! D2y_{-1} + p(p+1)(p-1)/3! D3y_{-2}
    #             + p(p+1)(p+2)(p-1)/4! D4y_{-2} + ...
    # Note: the linear term uses Dy_{-1} (the difference *behind* y0), not
    # Dy_0 -- that's what keeps this formula centered correctly for p < 0.
    if origin_idx - 1 >= 0:
        result += p * table[origin_idx - 1][1]

    if origin_idx - 1 >= 0 and origin_idx - 1 + 2 < n:
        result += (p * (p + 1) / 2) * table[origin_idx - 1][2]

    if origin_idx - 2 >= 0 and origin_idx - 2 + 3 < n:
        result += (p * (p + 1) * (p - 1) / 6) * table[origin_idx - 2][3]

    if origin_idx - 2 >= 0 and origin_idx - 2 + 4 < n:
        result += (p * (p + 1) * (p + 2) * (p - 1) / 24) * table[origin_idx - 2][4]

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
    print("=== Gauss Backward Interpolation ===")
    x_vals, y_vals = read_table()

    target_in = input("Enter target x, just before a middle table point [Enter for 1.75]: ").strip()
    target = float(target_in) if target_in else 1.75

    table, result, origin_idx, p = gauss_backward_interpolation(x_vals, y_vals, target)

    print(f"\nOrigin y0 = table row {origin_idx} (x0 = {x_vals[origin_idx]}), p = {p:.4f}")
    print(f"Interpolated y at x = {target}: {result:.4f}")
