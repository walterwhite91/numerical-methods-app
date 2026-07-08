"""
Euler's Method - MCSC 202

The simplest way to numerically solve an ODE y' = f(x, y) with a known
starting point. At each step, walk forward by h using the *current*
slope f(x, y) as if it stayed constant over the whole step. Cheap but
not very accurate -- error builds up step by step.
"""


def f(x, y):
    # Example ODE: dy/dx = x + y
    return x + y


def euler(x0, y0, h, steps):
    """
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
    print("=== Euler's Method: dy/dx = x + y, y(0) = 1, h = 0.1 ===\n")

    rows = euler(x0=0.0, y0=1.0, h=0.1, steps=2)

    print(f"{'step':>4} {'x':>8} {'y':>10} {'slope used':>12}")
    for i, x, y, slope in rows:
        slope_str = f"{slope:.4f}" if slope is not None else "-"
        print(f"{i:>4} {x:>8.2f} {y:>10.6f} {slope_str:>12}")

    print(f"\ny(0.2) approx {rows[-1][2]:.4f} (expected: 1.22)")
