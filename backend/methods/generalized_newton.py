from .utils import evaluate_function

def generalized_newton_method(func_str, deriv_str, x0, multiplicity=1, tol=1e-6, max_iter=100):
    """
    Solves for a root of a function using the Generalised Newton-Raphson Method
    for roots of known multiplicity m (as defined in MCSC-202).

    When a root has multiplicity m > 1, the standard Newton-Raphson converges
    only linearly. The generalised formula restores quadratic convergence:

        x_{n+1} = x_n - m * f(x_n) / f'(x_n)

    For m = 1 this reduces to the standard Newton-Raphson method.

    Args:
        func_str  : string expression for f(x)
        deriv_str : string expression for f'(x)
        x0        : initial guess
        multiplicity : integer root multiplicity m (default 1)
        tol       : convergence tolerance
        max_iter  : maximum number of iterations
    """
    steps = []
    m = int(multiplicity)
    x = x0

    for i in range(1, max_iter + 1):
        f_x  = evaluate_function(func_str,  x)
        df_x = evaluate_function(deriv_str, x)

        if df_x == 0:
            return {
                "success": False,
                "message": "Derivative is zero. Cannot continue.",
                "root": None,
                "steps": steps
            }

        x_new = x - m * f_x / df_x
        error = abs(x_new - x)

        step_data = {
            "iteration": i,
            "x":      x,
            "f_x":    f_x,
            "df_x":   df_x,
            "x_new":  x_new,
            "error":  error
        }
        steps.append(step_data)

        if error < tol:
            return {
                "success": True,
                "message": f"Converged to root after {i} iterations.",
                "root": x_new,
                "steps": steps
            }

        x = x_new

    return {
        "success": False,
        "message": f"Did not converge within {max_iter} iterations.",
        "root": x,
        "steps": steps
    }
