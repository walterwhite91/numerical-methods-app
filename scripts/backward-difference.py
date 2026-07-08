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


if __name__ == "__main__":
    print("=== Newton's Backward Interpolation: x = [1, 2, 3], y = [1, 4, 9] ===\n")

    x_vals = [1.0, 2.0, 3.0]
    y_vals = [1.0, 4.0, 9.0]  # y = x^2

    table, result = newton_backward_interpolation(x_vals, y_vals, 2.5)

    print("Backward difference table:")
    for i in range(len(y_vals)):
        row = " ".join(f"{table[i][j]:.4f}" for j in range(i + 1))
        print(f"  row {i} (x={x_vals[i]}): {row}")

    print(f"\nInterpolated y at x = 2.5: {result:.4f} (expected: 6.25)")
