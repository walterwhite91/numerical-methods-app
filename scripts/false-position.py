"""
False Position Method (Regula Falsi) - MCSC 202

Like bisection, this brackets a root inside [a, b]. But instead of always
cutting at the midpoint, it draws a straight line (a chord) between
(a, f(a)) and (b, f(b)) and uses where that line crosses zero as the next
guess. Usually converges faster than bisection because it "aims" at the
root instead of blindly halving.
"""


def f(x):
    # Same example function as the Bisection script: f(x) = x^3 - x - 1
    return x ** 3 - x - 1


def false_position(a, b, tol=1e-6, max_iter=100):
    """
    a, b     : interval endpoints; f(a) and f(b) must have opposite signs
    tol      : stop once |f(c)| is smaller than this
    max_iter : safety cap on iterations
    """
    fa = f(a)
    fb = f(b)

    if fa * fb >= 0:
        raise ValueError("f(a) and f(b) must have opposite signs.")

    rows = []

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
    print("=== False Position: f(x) = x^3 - x - 1 on [1, 2] ===\n")

    rows, root = false_position(1, 2)

    print(f"{'iter':>4} {'a':>10} {'b':>10} {'c':>12} {'f(c)':>14}")
    for i, a, b, c, fc in rows:
        print(f"{i:>4} {a:>10.6f} {b:>10.6f} {c:>12.6f} {fc:>14.8f}")

    print(f"\nRoot approx {root:.6f} after {len(rows)} iterations (expected approx 1.3247)")
