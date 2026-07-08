"""
False Position Method (Regula Falsi) - MCSC 202

Like bisection, this brackets a root inside [a, b]. But instead of always
cutting at the midpoint, it draws a straight line (a chord) between
(a, f(a)) and (b, f(b)) and uses where that line crosses zero as the next
guess. Usually converges faster than bisection because it "aims" at the
root instead of blindly halving.
"""

import math


def make_function(expr):
    """Turns a typed expression like "x**3 - x - 1" into a callable f(x)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x})

    return f


def false_position(f, a, b, tol=1e-6, max_iter=100):
    """
    f        : the function to find a root of, as a callable f(x)
    a, b     : interval endpoints; f(a) and f(b) must have opposite signs
    tol      : stop once |f(c)| is smaller than this
    max_iter : safety cap on iterations
    """
    fa = f(a)
    fb = f(b)

    if fa * fb >= 0:
        raise ValueError("f(a) and f(b) must have opposite signs.")

    rows = []
    c = a

    for i in range(1, max_iter + 1):
        # Chord formula: x-intercept of the line through (a, fa) and (b, fb)
        c = (a * fb - b * fa) / (fb - fa)
        fc = f(c)

        rows.append((i, a, b, c, fc))

        # Stop once f(c) is close enough to zero
        if abs(fc) < tol or fc == 0:
            return rows, c

        # Same bracketing logic as bisection: keep the half with the sign change
        if fa * fc < 0:
            b = c
            fb = fc
        else:
            a = c
            fa = fc

    return rows, c


if __name__ == "__main__":
    print("=== False Position Method ===")
    expr = input("Enter f(x), e.g. x**3 - x - 1 [Enter to use that example]: ").strip() or "x**3 - x - 1"
    f = make_function(expr)

    a_in = input("Enter a [Enter for 1]: ").strip()
    a = float(a_in) if a_in else 1.0
    b_in = input("Enter b [Enter for 2]: ").strip()
    b = float(b_in) if b_in else 2.0
    tol_in = input("Enter tolerance [Enter for 1e-6]: ").strip()
    tol = float(tol_in) if tol_in else 1e-6

    print(f"\n=== Solving f(x) = {expr}  on [{a}, {b}] ===\n")

    rows, root = false_position(f, a, b, tol=tol)

    print(f"{'iter':>4} {'a':>10} {'b':>10} {'c':>12} {'f(c)':>14}")
    for i, ai, bi, c, fc in rows:
        print(f"{i:>4} {ai:>10.6f} {bi:>10.6f} {c:>12.6f} {fc:>14.8f}")

    print(f"\nRoot approx {root:.6f} after {len(rows)} iterations")
