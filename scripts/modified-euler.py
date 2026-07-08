"""
Modified Euler's Method / Heun's Method - MCSC 202

Improves on plain Euler with a predictor-corrector pair: first take a
normal Euler step to *predict* the next y, then average the slope at the
start and at that predicted point, and use that averaged slope to
*correct* the step. Costs one extra function evaluation per step but is
noticeably more accurate.
"""


def f(x, y):
    # Same example ODE as Euler's method: dy/dx = x + y
    return x + y


def modified_euler(x0, y0, h, steps):
    """
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
    print("=== Modified Euler: dy/dx = x + y, y(0) = 1, h = 0.1 ===\n")

    rows = modified_euler(x0=0.0, y0=1.0, h=0.1, steps=2)

    print(f"{'step':>4} {'x_n':>8} {'y_n':>10} {'y_predict':>12} {'y_correct':>12}")
    for i, x, y, y_pred, y_corr in rows:
        print(f"{i:>4} {x:>8.2f} {y:>10.6f} {y_pred:>12.6f} {y_corr:>12.6f}")

    print(f"\ny(0.1) approx {rows[0][4]:.4f} (expected: 1.11)")
