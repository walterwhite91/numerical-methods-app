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
    print("=== Absolute & Relative Error ===")
    X_in = input("Enter true value X [Enter for 3.141592]: ").strip()
    X = float(X_in) if X_in else 3.141592
    X1_in = input("Enter approximate value X1 [Enter for 3.14]: ").strip()
    X1 = float(X1_in) if X1_in else 3.14

    E_A, E_R = errors(X, X1)

    print(f"\nTrue value X = {X}")
    print(f"Approximate value X1 = {X1}")
    print(f"Absolute error E_A = X - X1 = {E_A:.6f}")
    print(f"Relative error E_R = E_A / X = {E_R:.7f}")
