from .utils import evaluate_function

def secant_method(func_str, x0, x1, tol=1e-6, max_iter=100):
    """
    Solves for the root of a function using the Secant Method.
    Returns the root, a message, and a list of step dictionaries for the iteration table.
    """
    steps = []
    
    for i in range(1, max_iter + 1):
        f0 = evaluate_function(func_str, x0)
        f1 = evaluate_function(func_str, x1)
        
        if f1 - f0 == 0:
            return {
                "success": False,
                "message": "Denominator is zero (f1 = f0).",
                "root": None,
                "steps": steps
            }
            
        # Secant formula: x2 = x1 - f(x1) * (x1 - x0) / (f(x1) - f(x0))
        x2 = x1 - f1 * (x1 - x0) / (f1 - f0)
        error = abs(x2 - x1)
        
        step_data = {
            "iteration": i,
            "x_prev": x0,
            "x_curr": x1,
            "x_new": x2,
            "f_curr": f1,
            "error": error
        }
        steps.append(step_data)
        
        if error < tol:
            return {
                "success": True,
                "message": f"Converged to root after {i} iterations.",
                "root": x2,
                "steps": steps
            }
            
        x0 = x1
        x1 = x2
        
    return {
        "success": False,
        "message": f"Did not converge within {max_iter} iterations.",
        "root": x1,
        "steps": steps
    }
