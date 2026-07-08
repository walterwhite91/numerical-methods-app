"""
Newton's Backward Difference Interpolation - MCSC 202

Same idea as forward interpolation, but built around the *last* row of
the table instead of the first, so it works best when the target x is
near the end of the data.
"""


def backward_difference_table(y):
    n = len(y)
    table = [[0.0 for _ in range(n)] for _ in range(n)]

    for i in range(n):
        table[i][0] = y[i]

    # Build differences going up from the bottom of the table
    for j in range(1, n):
        for i in range(n - 1, j - 1, -1):
            table[i][j] = table[i][j - 1] - table[i - 1][j - 1]

    return table


def newton_backward_interpolation(x, y, target):
    n = len(x)
    h = x[1] - x[0]  # spacing between x values (assumed equal)
    table = backward_difference_table(y)

    # p is measured backward from the last x value, x_n
    p = (target - x[n - 1]) / h

    result = table[n - 1][0]  # start with y_n, the last row's first entry
    p_term = 1.0
    factorial = 1.0

    for j in range(1, n):
        p_term *= (p + j - 1)  # builds up p * (p+1) * (p+2) * ...
        factorial *= j
        result += (p_term / factorial) * table[n - 1][j]

    return table, result


def read_table():
    n_in = input("Enter number of data points [Enter for the example x=[1,2,3], y=[1,4,9]]: ").strip()
    if not n_in:
        return [1.0, 2.0, 3.0], [1.0, 4.0, 9.0]

    n = int(n_in)
    x = [float(v) for v in input(f"Enter {n} x-values (space separated, equally spaced): ").strip().split()]
    y = [float(v) for v in input(f"Enter {n} y-values (space separated): ").strip().split()]
    return x, y


if __name__ == "__main__":
    print("=== Newton's Backward Interpolation ===")
    x_vals, y_vals = read_table()

    target_in = input("Enter target x to interpolate at [Enter for 2.5]: ").strip()
    target = float(target_in) if target_in else 2.5

    table, result = newton_backward_interpolation(x_vals, y_vals, target)

    print("\nBackward difference table:")
    for i in range(len(y_vals)):
        row = " ".join(f"{table[i][j]:.4f}" for j in range(i + 1))
        print(f"  row {i} (x={x_vals[i]}): {row}")

    print(f"\nInterpolated y at x = {target}: {result:.4f}")
