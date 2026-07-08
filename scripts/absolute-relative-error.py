"""
Absolute & Relative Error - MCSC 202

The basic way to measure how far an approximation is from the true
value. Absolute error is the raw difference; relative error scales that
difference by the size of the true value, so a 0.001 error means
something very different for X = 1000 versus X = 0.001.

Note: kept signed here (not wrapped in abs()), matching the definition
used in class -- a positive error means the approximation undershot the
true value, negative means it overshot.
"""


def errors(X, X1):
    # Absolute error: how far the approximation X1 is from the true value X
    E_A = X - X1

    # Relative error: absolute error scaled by the true value's size
    E_R = E_A / X if X != 0 else float("nan")

    return E_A, E_R


if __name__ == "__main__":
    print("=== Absolute & Relative Error ===\n")

    X = 3.141592   # true value
    X1 = 3.14      # approximate value

    E_A, E_R = errors(X, X1)

    print(f"True value X = {X}")
    print(f"Approximate value X1 = {X1}")
    print(f"Absolute error E_A = X - X1 = {E_A:.6f} (expected: 0.001592)")
    print(f"Relative error E_R = E_A / X = {E_R:.7f} (expected: approx 0.0005067)")
