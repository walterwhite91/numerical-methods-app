"""
Newton's Forward Difference Interpolation - MCSC 202

Given equally-spaced (x, y) points, builds a forward difference table and
uses it to estimate y at some target x that's near the *start* of the
table. Good choice when the point you want is close to the first row.
"""


def forward_difference_table(y):
    n = len(y)
    # table[i][j] holds the j-th forward difference starting at row i
    table = [[0.0 for _ in range(n)] for _ in range(n)]

    # Column 0 is just the given y values
    for i in range(n):
        table[i][0] = y[i]

    # Each further column: difference of the two values diagonally below-left
    for j in range(1, n):
        for i in range(n - j):
            table[i][j] = table[i + 1][j - 1] - table[i][j - 1]

    return table


def newton_forward_interpolation(x, y, target):
    n = len(x)
    table = forward_difference_table(y)

    h = x[1] - x[0]              # spacing between x values (assumed equal)
    p = (target - x[0]) / h      # normalized distance from x0, in units of h

    result = table[0][0]  # start with y0, the top-left entry
    p_term = 1.0           # builds up p * (p-1) * (p-2) * ...
    factorial = 1

    for i in range(1, n):
        p_term *= (p - (i - 1))  # multiply in the next factor of p*(p-1)*...
        factorial *= i            # running i!
        # add the i-th term of the forward interpolation formula
        result += (p_term / factorial) * table[0][i]

    return table, result


if __name__ == "__main__":
    print("=== Newton's Forward Interpolation: x = [1, 2, 3], y = [1, 4, 9] ===\n")

    x_vals = [1.0, 2.0, 3.0]
    y_vals = [1.0, 4.0, 9.0]  # y = x^2

    table, result = newton_forward_interpolation(x_vals, y_vals, 1.5)

    print("Forward difference table:")
    for i, row in enumerate(table):
        print(f"  row {i} (x={x_vals[i]}): {[round(v, 4) for v in row[:len(table) - i]]}")

    print(f"\nInterpolated y at x = 1.5: {result:.4f} (expected: 2.25)")
