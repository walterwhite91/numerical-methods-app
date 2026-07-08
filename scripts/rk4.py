"""
Fourth-Order Runge-Kutta (RK4) - MCSC 202

The workhorse ODE solver: instead of one slope estimate (Euler) or two
(Modified Euler), it samples the slope four times per step -- at the
start, twice near the midpoint, and once at the end -- then combines
them with weights 1:2:2:1. Much more accurate per step than Euler or
Modified Euler, at the cost of four function evaluations per step
instead of one or two.
"""


def f(x, y):
    # Same example ODE used in the Euler scripts: dy/dx = x + y
    return x + y


def rk4(x0, y0, h, steps):
    """
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
    print("=== RK4: dy/dx = x + y, y(0) = 1, h = 0.1 ===\n")

    rows = rk4(x0=0.0, y0=1.0, h=0.1, steps=2)

    print(f"{'step':>4} {'x_n':>8} {'y_n':>10} {'k1':>8} {'k2':>8} {'k3':>8} {'k4':>8} {'y_n+1':>10}")
    for i, x, y, k1, k2, k3, k4, y_next in rows:
        print(f"{i:>4} {x:>8.2f} {y:>10.6f} {k1:>8.5f} {k2:>8.5f} {k3:>8.5f} {k4:>8.5f} {y_next:>10.6f}")

    print(f"\ny(0.2) approx {rows[-1][7]:.6f} (Euler gave 1.22 -- RK4 is far more accurate per step)")
