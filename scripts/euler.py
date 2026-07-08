"""
Euler's Method - MCSC 202

The simplest way to numerically solve an ODE y' = f(x, y) with a known
starting point. At each step, walk forward by h using the *current*
slope f(x, y) as if it stayed constant over the whole step. Cheap but
not very accurate -- error builds up step by step.
"""

import math


def make_function_xy(expr):
    """Turns a typed expression in x and y into a callable f(x, y)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x, y):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x, "y": y})

    return f


def euler(f, x0, y0, h, steps):
    """
    f      : the ODE's right-hand side, as a callable f(x, y) = dy/dx
    x0, y0 : initial condition
    h      : step size
    steps  : how many steps to take
    """
    x, y = x0, y0
    rows = [(0, x, y, None)]

    for i in range(1, steps + 1):
        slope = f(x, y)     # current slope, treated as constant for this step
        y = y + h * slope   # walk forward using that slope
        x = x + h

        rows.append((i, x, y, slope))

    return rows


if __name__ == "__main__":
    print("=== Euler's Method ===")
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

    rows = euler(f, x0, y0, h, steps)

    print(f"{'step':>4} {'x':>8} {'y':>10} {'slope used':>12}")
    for i, x, y, slope in rows:
        slope_str = f"{slope:.4f}" if slope is not None else "-"
        print(f"{i:>4} {x:>8.2f} {y:>10.6f} {slope_str:>12}")

    print(f"\ny({rows[-1][1]:.2f}) approx {rows[-1][2]:.4f}")
