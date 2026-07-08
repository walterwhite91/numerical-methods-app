"""
Newton-Raphson for Systems (Cramer's Rule form) - MCSC 202

Solves two nonlinear equations f(x,y) = 0, g(x,y) = 0 together. The idea:
near the current guess (x0, y0), treat f and g as approximately linear
(first-order Taylor expansion), which turns the problem into a small 2x2
linear system for the correction step (h, k). That 2x2 system is solved
here with Cramer's rule, matching the notation used in class:
f_0, g_0 for f(x0,y0), g(x0,y0), and determinants D, D1, D2.
"""

import math


def make_function_xy(expr):
    """Turns a typed expression in x and y into a callable f(x, y)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x, y):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x, "y": y})

    return f


def newton_system(f, g, f_x, f_y, g_x, g_y, x0, y0, tol=1e-6, max_iter=50):
    """
    f, g               : the two equations, as callables f(x,y), g(x,y)
    f_x, f_y, g_x, g_y : their partial derivatives, as callables (x,y) -> value
    x0, y0             : initial guess
    tol                : stop once both corrections h and k are smaller than this
    max_iter           : safety cap on iterations
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
    print("=== Newton-Raphson for Systems ===")
    print("Enter f(x,y), g(x,y) and their four partial derivatives (worked out by hand).")
    f_expr = input("f(x,y), e.g. y**2 - 5*y + 4 [Enter to use that example]: ").strip() or "y**2 - 5*y + 4"
    g_expr = input("g(x,y), e.g. 3*x**2*y - 10*x + 7 [Enter to use that example]: ").strip() \
        or "3*x**2*y - 10*x + 7"
    fx_expr = input("df/dx, e.g. 0 [Enter to use that example]: ").strip() or "0"
    fy_expr = input("df/dy, e.g. 2*y - 5 [Enter to use that example]: ").strip() or "2*y - 5"
    gx_expr = input("dg/dx, e.g. 6*x*y - 10 [Enter to use that example]: ").strip() or "6*x*y - 10"
    gy_expr = input("dg/dy, e.g. 3*x**2 [Enter to use that example]: ").strip() or "3*x**2"

    f = make_function_xy(f_expr)
    g = make_function_xy(g_expr)
    f_x = make_function_xy(fx_expr)
    f_y = make_function_xy(fy_expr)
    g_x = make_function_xy(gx_expr)
    g_y = make_function_xy(gy_expr)

    x0_in = input("Enter initial guess x0 [Enter for 0]: ").strip()
    x0 = float(x0_in) if x0_in else 0.0
    y0_in = input("Enter initial guess y0 [Enter for 0]: ").strip()
    y0 = float(y0_in) if y0_in else 0.0

    print(f"\n=== Solving f = {f_expr},  g = {g_expr},  starting at ({x0}, {y0}) ===\n")

    rows, x, y = newton_system(f, g, f_x, f_y, g_x, g_y, x0, y0)

    print(f"{'iter':>4} {'x0':>8} {'y0':>8} {'h':>8} {'k':>8} {'x1':>8} {'y1':>8}")
    for i, xa, ya, h, k, xb, yb in rows:
        print(f"{i:>4} {xa:>8.4f} {ya:>8.4f} {h:>8.4f} {k:>8.4f} {xb:>8.4f} {yb:>8.4f}")

    print(f"\nConverged to x approx {x:.4f}, y approx {y:.4f}")
