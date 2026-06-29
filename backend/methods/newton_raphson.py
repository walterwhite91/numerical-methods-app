from .utils import evaluate_function

def newton_raphson_method(func_str, deriv_str, x0, tol=1e-6, max_iter=100):
    """
    Solves for the root of a function using the Newton-Raphson Method.
    Requires both the function and its derivative as strings.
    """
    steps = []
    
    x = x0
    for i in range(1, max_iter + 1):
        f_x = evaluate_function(func_str, x)
        df_x = evaluate_function(deriv_str, x)
        
        if df_x == 0:
            return {
                "success": False,
                "message": "Derivative is zero. Cannot continue.",
                "root": None,
                "steps": steps
            }
            
        x_new = x - f_x / df_x
        error = abs(x_new - x)
        
        step_data = {
            "iteration": i,
            "x": x,
            "f_x": f_x,
            "df_x": df_x,
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
