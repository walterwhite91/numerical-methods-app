"""
Trapezoidal Rule - MCSC 202

Approximates a definite integral by slicing [a, b] into n strips and
treating the top of each strip as a straight line (a trapezoid) instead
of following the curve exactly. Simple and always usable, but less
accurate than Simpson's rules for the same number of points.
"""


def f(x):
    return x ** 2


def trapezoidal(a, b, n):
    """
    a, b : integration limits
    n    : number of subintervals (strips)
    """
    h = (b - a) / n  # width of each strip

    # Evaluate y at every x_0, x_1, ..., x_n
    y = [f(a + i * h) for i in range(n + 1)]

    # Trapezoidal formula: h/2 * [ (first + last) + 2 * (everything in between) ]
    middle_sum = sum(y[1:-1])
    integral = (h / 2) * (y[0] + y[-1] + 2 * middle_sum)

    return integral, y, h


if __name__ == "__main__":
    print("=== Trapezoidal Rule: integral of x^2 from 0 to 1, n = 4 ===\n")

    integral, y, h = trapezoidal(0, 1, 4)

    print(f"h = {h}")
    print("y values:", [round(v, 4) for v in y])
    print(f"\nIntegral approx {integral:.5f} (exact value: 1/3 approx 0.33333)")
