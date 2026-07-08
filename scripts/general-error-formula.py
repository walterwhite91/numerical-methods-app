"""
General Error Formula (Error Propagation) - MCSC 202

If a quantity u is computed from several measured/approximate inputs
n1, n2, ..., each with its own small error, how much error does that
push into u? First-order Taylor expansion gives the answer: multiply
each input's error by how sensitive u is to that input (its partial
derivative), then add those up.

Partial derivatives are estimated numerically here with the central
difference formula, rather than worked out by hand -- so this script
also doubles as a tiny demo of numerical differentiation.
"""


def u(n1, n2, n3):
    # Example: u = (n1 * n2) / n3
    return (n1 * n2) / n3


def partial_derivative(func, values, index, h=1e-6):
    """
    Numerically estimates d(func)/d(values[index]) using the central
    difference formula: (f(x+h) - f(x-h)) / (2h)
    """
    forward = list(values)
    backward = list(values)
    forward[index] += h
    backward[index] -= h
    return (func(*forward) - func(*backward)) / (2 * h)


def propagated_error(func, values, deltas):
    """
    values : the (n1, n2, n3, ...) point where u is evaluated
    deltas : the known/estimated error in each n_i
    Returns (delta_u, max_delta_u): the signed sum and the worst-case
    absolute bound, following the notes' Delta_u and (Delta_u)_max formulas.
    """
    delta_u = 0.0
    max_delta_u = 0.0

    for i, delta_n in enumerate(deltas):
        # How sensitive u is to this particular input
        df_dni = partial_derivative(func, values, i)

        delta_u += delta_n * df_dni           # signed contribution
        max_delta_u += abs(delta_n * df_dni)   # worst-case contribution

    return delta_u, max_delta_u


if __name__ == "__main__":
    print("=== General Error Formula: u = (n1 * n2) / n3 ===\n")

    values = (10.0, 4.0, 2.0)   # n1, n2, n3
    deltas = (0.1, 0.05, 0.02)  # known error in each input

    delta_u, max_delta_u = propagated_error(u, values, deltas)

    print(f"u(n1, n2, n3) = {u(*values):.4f}")
    print(f"Estimated error contribution per variable:")
    for i, (val, delta) in enumerate(zip(values, deltas), start=1):
        df_dni = partial_derivative(u, values, i - 1)
        print(f"  n{i} = {val}, delta_n{i} = {delta}, du/dn{i} approx {df_dni:.4f}, contributes {delta * df_dni:.4f}")

    print(f"\nDelta_u (signed sum) approx {delta_u:.4f}")
    print(f"(Delta_u)_max (worst case bound) approx {max_delta_u:.4f}")
