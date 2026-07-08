"""
Simpson's 1/3 Rule - MCSC 202

Also approximates a definite integral by slicing [a, b] into n strips,
but instead of straight lines (Trapezoidal), it fits a parabola through
every group of 3 consecutive points. That's why n must be even -- the
strips are processed two at a time. More accurate than the Trapezoidal
Rule for the same n.
"""


def f(x):
    return x ** 2


def simpson_13(a, b, n):
    """
    a, b : integration limits
    n    : number of subintervals; must be even
    """
    if n % 2 != 0:
        raise ValueError("Simpson's 1/3 rule requires n to be even.")

    h = (b - a) / n
    y = [f(a + i * h) for i in range(n + 1)]

    # Odd-indexed points get weight 4, even-indexed interior points get weight 2
    sum_odd = sum(y[i] for i in range(1, n, 2))
    sum_even = sum(y[i] for i in range(2, n, 2))

    integral = (h / 3) * (y[0] + y[-1] + 4 * sum_odd + 2 * sum_even)

    return integral, y, h


if __name__ == "__main__":
    print("=== Simpson's 1/3 Rule: integral of x^2 from 0 to 1, n = 4 ===\n")

    integral, y, h = simpson_13(0, 1, 4)

    print(f"h = {h}")
    print("y values:", [round(v, 4) for v in y])
    print(f"\nIntegral approx {integral:.5f} (exact value: 1/3 approx 0.33333 -- exact here since x^2 is quadratic)")
