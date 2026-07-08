"""
Fixed Point Iteration for Systems - MCSC 202

Solves two nonlinear equations f(x,y) = 0, g(x,y) = 0 by rewriting them as
x = Phi(x,y) and y = Psi(x,y), then repeatedly plugging the previous
(x, y) into both formulas to get the next (x, y). Converges only if the
rewritten formulas are "contractive" near the root -- roughly, the
partial derivatives of Phi and Psi can't be too large.
"""

import math


def make_function_xy(expr):
    """Turns a typed expression in x and y into a callable f(x, y)."""
    allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}

    def f(x, y):
        return eval(expr, {"__builtins__": {}}, {**allowed_names, "x": x, "y": y})

    return f


def fixed_point_system(phi, psi, x0, y0, tol=1e-4, max_iter=50):
    """
    phi, psi : callables phi(x,y) -> next y, psi(x,y) -> next x
    x0, y0   : initial guess
    tol      : stop once both x and y change by less than this
    max_iter : safety cap on iterations

    Note: here phi updates y and psi updates x, matching the class
    notes' variable pairing -- always double-check which formula solves
    for which variable before wiring this up to a new problem.
    """
    x, y = x0, y0
    rows = []

    for i in range(1, max_iter + 1):
        # Compute both new values from the *old* (x, y) pair -- neither
        # update sees the other's new value this same iteration
        y_new = phi(x, y)
        x_new = psi(x, y)

        rows.append((i, x_new, y_new))

        if abs(x_new - x) < tol and abs(y_new - y) < tol:
            return rows, x_new, y_new

        x, y = x_new, y_new

    return rows, x, y


if __name__ == "__main__":
    print("=== Fixed Point Iteration (Systems) ===")
    print("Rewrite your two equations as y = Phi(x,y) and x = Psi(x,y) first.")
    phi_expr = input("Enter Phi(x,y), e.g. (y**2 + 4) / 5 [Enter to use that example]: ").strip() \
        or "(y**2 + 4) / 5"
    psi_expr = input("Enter Psi(x,y), e.g. (3*y*x**2 + 7) / 10 [Enter to use that example]: ").strip() \
        or "(3*y*x**2 + 7) / 10"
    phi = make_function_xy(phi_expr)
    psi = make_function_xy(psi_expr)

    x0_in = input("Enter initial guess x0 [Enter for 0]: ").strip()
    x0 = float(x0_in) if x0_in else 0.0
    y0_in = input("Enter initial guess y0 [Enter for 0]: ").strip()
    y0 = float(y0_in) if y0_in else 0.0
    tol_in = input("Enter tolerance [Enter for 1e-4]: ").strip()
    tol = float(tol_in) if tol_in else 1e-4

    print(f"\n=== Solving y = {phi_expr},  x = {psi_expr},  starting at ({x0}, {y0}) ===\n")

    rows, x, y = fixed_point_system(phi, psi, x0, y0, tol=tol)

    print(f"{'iter':>4} {'x':>10} {'y':>10}")
    for i, xi, yi in rows:
        print(f"{i:>4} {xi:>10.4f} {yi:>10.4f}")

    print(f"\nConverged to x approx {x:.4f}, y approx {y:.4f}")
