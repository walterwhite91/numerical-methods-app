from .utils import evaluate_function

def bisection_method(func_str, a, b, tol=1e-6, max_iter=100):
    """
    Solves for the root of a function using the Bisection Method.
    Returns the root, a message, and a list of step dictionaries for the iteration table.
    """
    steps = []
    
    fa = evaluate_function(func_str, a)
    fb = evaluate_function(func_str, b)
    
    if fa * fb >= 0:
        return {
            "success": False,
            "message": "Function must have opposite signs at a and b (f(a) * f(b) < 0).",
            "root": None,
            "steps": steps
        }
    
    for i in range(1, max_iter + 1):
        midpoint = (a + b) / 2.0
        f_mid = evaluate_function(func_str, midpoint)
        error = abs(b - a) / 2.0
        
        step_data = {
            "iteration": i,
            "a": a,
            "b": b,
            "midpoint": midpoint,
            "f_mid": f_mid,
            "error": error
        }
        steps.append(step_data)
        
        if error < tol or f_mid == 0:
            return {
                "success": True,
                "message": f"Converged to root after {i} iterations.",
                "root": midpoint,
                "steps": steps
            }
            
        if fa * f_mid < 0:
            b = midpoint
            fb = f_mid
        else:
            a = midpoint
            fa = f_mid
            
    return {
        "success": False,
        "message": f"Did not converge within {max_iter} iterations.",
        "root": midpoint,
        "steps": steps
    }
