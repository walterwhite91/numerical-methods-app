"""
Newton-Raphson for Systems (Cramer's Rule form) - MCSC 202

Solves two nonlinear equations f(x,y) = 0, g(x,y) = 0 together. The idea:
near the current guess (x0, y0), treat f and g as approximately linear
(first-order Taylor expansion), which turns the problem into a small 2x2
linear system for the correction step (h, k). That 2x2 system is solved
here with Cramer's rule, matching the notation used in class:
f_0, g_0 for f(x0,y0), g(x0,y0), and determinants D, D1, D2.
"""


def f(x, y):
    # From the class example: y^2 - 5y + 4 = 0
    return y ** 2 - 5 * y + 4


def g(x, y):
    # From the class example: 3x^2 y - 10x + 7 = 0
    return 3 * x ** 2 * y - 10 * x + 7


# Partial derivatives, worked out by hand ahead of time for this example.
def f_x(x, y):
    return 0.0


def f_y(x, y):
    return 2 * y - 5


def g_x(x, y):
    return 6 * x * y - 10


def g_y(x, y):
    return 3 * x ** 2


def newton_system(x0, y0, tol=1e-6, max_iter=50):
    """
    x0, y0   : initial guess
    tol      : stop once both corrections h and k are smaller than this
    max_iter : safety cap on iterations
    """
    x, y = x0, y0
    rows = []

    for i in range(1, max_iter + 1):
        # f_0 and g_0: the notes' shorthand for f(x0,y0) and g(x0,y0)
        f_0 = f(x, y)
        g_0 = g(x, y)

        fx, fy = f_x(x, y), f_y(x, y)
        gx, gy = g_x(x, y), g_y(x, y)

        # D is the Jacobian determinant of the linearized system
        D = fx * gy - fy * gx
        # D1, D2: Cramer's rule numerators for solving [fx fy; gx gy] [h;k] = [-f0; -g0]
        D1 = (-f_0) * gy - fy * (-g_0)
        D2 = fx * (-g_0) - (-f_0) * gx

        if D == 0:
            raise ValueError("Jacobian determinant D is zero; can't continue.")

        h = D1 / D  # correction to x
        k = D2 / D  # correction to y

        x_new, y_new = x + h, y + k
        rows.append((i, x, y, h, k, x_new, y_new))

        if abs(h) < tol and abs(k) < tol:
            return rows, x_new, y_new

        x, y = x_new, y_new

    return rows, x, y


if __name__ == "__main__":
    print("=== Newton-Raphson for Systems: starting at (0, 0) ===\n")

    rows, x, y = newton_system(0, 0)

    print(f"{'iter':>4} {'x0':>8} {'y0':>8} {'h':>8} {'k':>8} {'x1':>8} {'y1':>8}")
    for i, x0, y0, h, k, x1, y1 in rows:
        print(f"{i:>4} {x0:>8.4f} {y0:>8.4f} {h:>8.4f} {k:>8.4f} {x1:>8.4f} {y1:>8.4f}")

    print(f"\nFirst step: h = {rows[0][3]:.1f}, k = {rows[0][4]:.1f} (matches notes: h=0.7, k=0.8)")
    print(f"Converged to x approx {x:.4f}, y approx {y:.4f}")
