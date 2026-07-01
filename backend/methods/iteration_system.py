from .utils import evaluate_function

def iteration_method_system(func_strs, init_vars, tol=1e-6, max_iter=100):
    """
    Solves a system of nonlinear equations using Iteration Method (Fixed Point).
    func_strs: list of string formulas for g_i (e.g. ['(x*y + 1)/2', '(x**2 - 3)/y'])
    init_vars: dict of initial variable values e.g. {'x': 1, 'y': 2}
    """
    steps = []
    vars_current = init_vars.copy()
    
    for i in range(1, max_iter + 1):
        try:
            new_vals = evaluate_system(func_strs, vars_current)
        except Exception as e:
            return {"success": False, "message": str(e), "steps": steps}
            
        error = max(abs(new_vals[idx] - vars_current[k]) for idx, k in enumerate(vars_current.keys()))
        
        step_data = {
            "iteration": i,
            "variables": vars_current.copy(),
            "new_variables": dict(zip(vars_current.keys(), new_vals)),
            "error": error
        }
        steps.append(step_data)
        
        # Update for next iteration
        vars_current = dict(zip(vars_current.keys(), new_vals))
        
        if error < tol:
            return {
                "success": True,
                "message": f"Converged after {i} iterations.",
                "solution": vars_current,
                "steps": steps
            }
            
    return {
        "success": False,
        "message": f"Did not converge within {max_iter} iterations.",
        "solution": vars_current,
        "steps": steps
    }
