"""
Fourth-Order Runge-Kutta (RK4) - MCSC 202

The workhorse ODE solver: instead of one slope estimate (Euler) or two
(Modified Euler), it samples the slope four times per step -- at the
start, twice near the midpoint, and once at the end -- then combines
them with weights 1:2:2:1. Much more accurate per step than Euler or
Modified Euler, at the cost of four function evaluations per step
instead of one or two.
"""

import math


def make_function_xy(expr):
    """Turns a typed expression in x and y into a callable f(x, y)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x, y):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x, "y": y})

    return f


def rk4(f, x0, y0, h, steps):
    """
    f      : the ODE's right-hand side, as a callable f(x, y) = dy/dx
    x0, y0 : initial condition
    h      : step size
    steps  : how many steps to take
    """
    x, y = x0, y0
    rows = []

    for i in range(steps):
        k1 = h * f(x, y)                       # slope at the start of the step
        k2 = h * f(x + h / 2, y + k1 / 2)       # slope at the midpoint, using k1
        k3 = h * f(x + h / 2, y + k2 / 2)       # slope at the midpoint again, using k2
        k4 = h * f(x + h, y + k3)               # slope at the end of the step, using k3

        # Weighted average of the four slopes: end points count once,
        # midpoint estimates count twice since they're usually more accurate
        y_next = y + (k1 + 2 * k2 + 2 * k3 + k4) / 6
        x_next = x + h

        rows.append((i + 1, x, y, k1, k2, k3, k4, y_next))

        x, y = x_next, y_next

    return rows


if __name__ == "__main__":
    print("=== Fourth-Order Runge-Kutta (RK4) ===")
    expr = input("Enter dy/dx = f(x,y), e.g. x + y [Enter to use that example]: ").strip() or "x + y"
    f = make_function_xy(expr)

    x0_in = input("Enter x0 [Enter for 0]: ").strip()
    x0 = float(x0_in) if x0_in else 0.0
    y0_in = input("Enter y0 [Enter for 1]: ").strip()
    y0 = float(y0_in) if y0_in else 1.0
    h_in = input("Enter step size h [Enter for 0.1]: ").strip()
    h = float(h_in) if h_in else 0.1
    steps_in = input("Enter number of steps [Enter for 2]: ").strip()
    steps = int(steps_in) if steps_in else 2

    print(f"\n=== Solving dy/dx = {expr},  y({x0}) = {y0},  h = {h} ===\n")

    rows = rk4(f, x0, y0, h, steps)

    print(f"{'step':>4} {'x_n':>8} {'y_n':>10} {'k1':>8} {'k2':>8} {'k3':>8} {'k4':>8} {'y_n+1':>10}")
    for i, x, y, k1, k2, k3, k4, y_next in rows:
        print(f"{i:>4} {x:>8.2f} {y:>10.6f} {k1:>8.5f} {k2:>8.5f} {k3:>8.5f} {k4:>8.5f} {y_next:>10.6f}")

    print(f"\ny after {steps} step(s) approx {rows[-1][7]:.6f}")
