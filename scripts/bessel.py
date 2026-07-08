"""
Bessel's Interpolation Formula - MCSC 202

Similar in spirit to Stirling's formula, but centered *between* two
points y0 and y1 rather than on a single origin. Most accurate when the
target x sits close to the midpoint of the interval [x0, x1].
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


def bessel_interpolation(x, y, target):
    n = len(x)
    h = x[1] - x[0]
    table = forward_difference_table(y)

    # origin_idx is x0, the left endpoint of the bracketing interval [x0, x1]
    origin_idx = int((target - x[0]) / h)
    p = (target - x[origin_idx]) / h

    y0 = table[origin_idx][0]
    y1 = table[origin_idx + 1][0] if origin_idx + 1 < n else y0

    result = (y0 + y1) / 2  # base: average of the two straddling points

    if origin_idx + 1 < n:
        result += (p - 0.5) * table[origin_idx][1]  # (p - 1/2) * Dy0

    if origin_idx - 1 >= 0 and origin_idx + 2 < n:
        avg_d2 = (table[origin_idx - 1][2] + table[origin_idx][2]) / 2.0
        result += (p * (p - 1) / 2) * avg_d2

    if origin_idx - 1 >= 0 and origin_idx - 1 + 3 < n:
        coeff = p * (p - 1) * (p - 0.5) / 6
        result += coeff * table[origin_idx - 1][3]

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
    print("=== Bessel's Interpolation Formula ===")
    x_vals, y_vals = read_table()

    target_in = input("Enter target x, near the midpoint of two table points [Enter for 2.5]: ").strip()
    target = float(target_in) if target_in else 2.5

    table, result, origin_idx, p = bessel_interpolation(x_vals, y_vals, target)

    print(f"\nBracketing x0 = {x_vals[origin_idx]}, p = {p:.4f}")
    print(f"Interpolated y at x = {target}: {result:.4f}")
