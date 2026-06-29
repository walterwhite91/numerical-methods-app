from .utils import evaluate_function

def false_position_method(func_str, a, b, tol=1e-6, max_iter=100):
    """
    Solves for the root of a function using the False Position (Regula Falsi) Method.
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
    
    x_prev = a
    for i in range(1, max_iter + 1):
        # False position formula
        c = (a * fb - b * fa) / (fb - fa)
        fc = evaluate_function(func_str, c)
        
        error = abs(c - x_prev) if i > 1 else abs(b - a)
        
        step_data = {
            "iteration": i,
            "a": a,
            "b": b,
            "c": c,
            "f_c": fc,
            "error": error
        }
        steps.append(step_data)
        
        if error < tol or fc == 0:
            return {
                "success": True,
                "message": f"Converged to root after {i} iterations.",
                "root": c,
                "steps": steps
            }
            
        if fa * fc < 0:
            b = c
            fb = fc
        else:
            a = c
            fa = fc
            
        x_prev = c
            
    return {
        "success": False,
        "message": f"Did not converge within {max_iter} iterations.",
        "root": x_prev,
        "steps": steps
    }
