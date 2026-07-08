"""
Lagrange's Interpolation Formula - MCSC 202

Builds the interpolating polynomial directly as a weighted sum of the
given y values -- no difference table needed. Unlike the Newton/Gauss/
Stirling/Bessel/Everett formulas, this works for data points that
*aren't* equally spaced.
"""


def lagrange_interpolation(x, y, target):
    n = len(x)
    total = 0.0
    basis_values = []

    for i in range(n):
        # Build L_i(x): the product of (x - x_j)/(x_i - x_j) over every j != i.
        # L_i(x_i) = 1 and L_i(x_j) = 0 for j != i by construction.
        Li = 1.0
        for j in range(n):
            if j != i:
                Li *= (target - x[j]) / (x[i] - x[j])

        basis_values.append(Li)
        total += y[i] * Li  # weight each y_i by how much its basis polynomial contributes

    return basis_values, total


def read_points():
    n_in = input("Enter number of data points [Enter for the example (2,4), (5,25), (8,64)]: ").strip()
    if not n_in:
        return [2.0, 5.0, 8.0], [4.0, 25.0, 64.0]

    n = int(n_in)
    print("Points don't need to be equally spaced.")
    x = [float(v) for v in input(f"Enter {n} x-values (space separated): ").strip().split()]
    y = [float(v) for v in input(f"Enter {n} y-values (space separated): ").strip().split()]
    return x, y


if __name__ == "__main__":
    print("=== Lagrange's Interpolation Formula ===")
    x_vals, y_vals = read_points()

    target_in = input("Enter target x to interpolate at [Enter for 6]: ").strip()
    target = float(target_in) if target_in else 6.0

    basis_values, result = lagrange_interpolation(x_vals, y_vals, target)

    print("\nBasis polynomial values L_i(x) at the target:")
    for i, (xi, yi, Li) in enumerate(zip(x_vals, y_vals, basis_values)):
        print(f"  L_{i}({target}) = {Li:.4f}   (x_{i}={xi}, y_{i}={yi})")

    print(f"\nInterpolated y at x = {target}: {result:.4f}")
