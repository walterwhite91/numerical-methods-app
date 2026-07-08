"""
Modified Euler's Method / Heun's Method - MCSC 202

Improves on plain Euler with a predictor-corrector pair: first take a
normal Euler step to *predict* the next y, then average the slope at the
start and at that predicted point, and use that averaged slope to
*correct* the step. Costs one extra function evaluation per step but is
noticeably more accurate.
"""

import math


def make_function_xy(expr):
    """Turns a typed expression in x and y into a callable f(x, y)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x, y):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x, "y": y})

    return f


def modified_euler(f, x0, y0, h, steps):
    """
    f      : the ODE's right-hand side, as a callable f(x, y) = dy/dx
    x0, y0 : initial condition
    h      : step size
    steps  : how many steps to take
    """
    x, y = x0, y0
    rows = []

    for i in range(steps):
        slope_start = f(x, y)               # slope at the start of the step
        y_predict = y + h * slope_start     # plain Euler step: the "predictor"

        x_next = x + h
        slope_end = f(x_next, y_predict)    # slope at the predicted point

        # Corrector: average the two slopes instead of using just one
        y_correct = y + (h / 2) * (slope_start + slope_end)

        rows.append((i + 1, x, y, y_predict, y_correct))

        x, y = x_next, y_correct

    return rows


if __name__ == "__main__":
    print("=== Modified Euler's Method (Heun's Method) ===")
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

    rows = modified_euler(f, x0, y0, h, steps)

    print(f"{'step':>4} {'x_n':>8} {'y_n':>10} {'y_predict':>12} {'y_correct':>12}")
    for i, x, y, y_pred, y_corr in rows:
        print(f"{i:>4} {x:>8.2f} {y:>10.6f} {y_pred:>12.6f} {y_corr:>12.6f}")

    print(f"\ny after {steps} step(s) approx {rows[-1][4]:.4f}")
