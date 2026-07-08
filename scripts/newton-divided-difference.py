"""
Newton's General Interpolation Formula (Divided Differences) - MCSC 202

An alternative to Lagrange's formula for unequally spaced data. Instead of
computing basis polynomials directly, it builds a "divided difference"
table (similar in spirit to the forward/backward difference tables, but
adjusted for uneven spacing) and uses it to build the polynomial one term
at a time.
"""


def divided_difference_table(x, y):
    n = len(x)
    # table[i][0] = y_i; table[i][j] = the j-th order divided difference
    # of the points starting at index i
    table = [[0.0 for _ in range(n)] for _ in range(n)]
    for i in range(n):
        table[i][0] = y[i]

    for j in range(1, n):
        for i in range(n - j):
            # [x_i,...,x_{i+j}] = ([x_{i+1},...,x_{i+j}] - [x_i,...,x_{i+j-1}]) / (x_{i+j} - x_i)
            table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (x[i + j] - x[i])

    return table


def newton_divided_difference(x, y, target):
    n = len(x)
    table = divided_difference_table(x, y)

    result = table[0][0]  # y0
    product = 1.0

    for j in range(1, n):
        product *= (target - x[j - 1])  # builds up (x-x0)(x-x1)...
        result += product * table[0][j]  # add the j-th divided-difference term

    return table, result


def read_points():
    n_in = input("Enter number of data points [Enter for the notes' log-table example]: ").strip()
    if not n_in:
        # From the notes (pg 71): find log10 near x=301
        return [300.0, 304.0, 305.0, 307.0], [2.4771, 2.4829, 2.4873, 2.4871]

    n = int(n_in)
    print("Points don't need to be equally spaced.")
    x = [float(v) for v in input(f"Enter {n} x-values (space separated): ").strip().split()]
    y = [float(v) for v in input(f"Enter {n} y-values (space separated): ").strip().split()]
    return x, y


if __name__ == "__main__":
    print("=== Newton's Divided Difference Interpolation ===")
    x_vals, y_vals = read_points()

    target_in = input("Enter target x to interpolate at [Enter for 301]: ").strip()
    target = float(target_in) if target_in else 301.0

    table, result = newton_divided_difference(x_vals, y_vals, target)

    print("\nDivided difference table:")
    for i, row in enumerate(table):
        print(f"  row {i} (x={x_vals[i]}): {[round(v, 6) for v in row[:len(table) - i]]}")

    print(f"\nInterpolated y at x = {target}: {result:.4f}")
