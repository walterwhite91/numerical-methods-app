"""
Simpson's 3/8 Rule - MCSC 202

Same spirit as Simpson's 1/3 Rule, but fits a cubic curve through every
group of 4 consecutive points instead of a parabola through 3. That
means n must be a multiple of 3. Slightly different weighting pattern
(3, 3, 2, 3, 3, 2, ...) but similar accuracy to the 1/3 rule.
"""


def f(x):
    return x ** 2


def simpson_38(a, b, n):
    """
    a, b : integration limits
    n    : number of subintervals; must be a multiple of 3
    """
    if n % 3 != 0:
        raise ValueError("Simpson's 3/8 rule requires n to be a multiple of 3.")

    h = (b - a) / n
    y = [f(a + i * h) for i in range(n + 1)]

    # Points at multiples of 3 get weight 2, all other interior points get weight 3
    sum_mult3 = sum(y[i] for i in range(3, n, 3))
    sum_rest = sum(y[i] for i in range(1, n) if i % 3 != 0)

    integral = (3 * h / 8) * (y[0] + y[-1] + 3 * sum_rest + 2 * sum_mult3)

    return integral, y, h


if __name__ == "__main__":
    print("=== Simpson's 3/8 Rule: integral of x^2 from 0 to 1, n = 3 ===\n")

    integral, y, h = simpson_38(0, 1, 3)

    print(f"h = {h}")
    print("y values:", [round(v, 4) for v in y])
    print(f"\nIntegral approx {integral:.5f} (exact value: 1/3 approx 0.33333 -- exact here since x^2 is quadratic)")
