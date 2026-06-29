from .utils import evaluate_function

def generalized_newton_method(func_str, deriv_str, deriv2_str, x0, tol=1e-6, max_iter=100):
    """
    Solves for the root of a function using the Generalized Newton-Raphson Method
    (also known as Chebyshev's method or Halley's method depending on the exact formula).
    Here we implement the standard generalized Newton's method for multiple roots
    where we use f, f', and f'' if multiplicity is unknown.
    Actually, a common Generalized Newton formula for a root with multiplicity p > 1:
    x_new = x - f(x)/f'(x) * (something) or x_new = x - f(x)f'(x) / (f'(x)^2 - f(x)f''(x)).
    We will use x_{n+1} = x_n - [f(x_n) * f'(x_n)] / [ (f'(x_n))^2 - f(x_n)*f''(x_n) ]
    """
    steps = []
    
    x = x0
    for i in range(1, max_iter + 1):
        f_x = evaluate_function(func_str, x)
        df_x = evaluate_function(deriv_str, x)
        d2f_x = evaluate_function(deriv2_str, x)
        
        denominator = (df_x**2) - (f_x * d2f_x)
        
        if denominator == 0:
            return {
                "success": False,
                "message": "Denominator is zero. Cannot continue.",
                "root": None,
                "steps": steps
            }
            
        x_new = x - (f_x * df_x) / denominator
        error = abs(x_new - x)
        
        step_data = {
            "iteration": i,
            "x": x,
            "f_x": f_x,
            "df_x": df_x,
            "d2f_x": d2f_x,
            "x_new": x_new,
            "error": error
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
