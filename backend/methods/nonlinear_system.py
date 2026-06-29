from .utils import evaluate_system, solve_linear_system

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

def newton_raphson_system(f_strs, J_strs, init_vars, tol=1e-6, max_iter=100):
    """
    Solves a system of nonlinear equations using Newton-Raphson.
    f_strs: list of strings for F (the functions set to 0)
    J_strs: list of lists of strings representing the Jacobian matrix
            e.g. [['2*x', '1'], ['3*y', 'x']]
    init_vars: dict of initial values
    """
    steps = []
    vars_current = init_vars.copy()
    keys = list(vars_current.keys())
    n = len(keys)
    
    for i in range(1, max_iter + 1):
        try:
            # Evaluate F matrix (vector)
            F_vals = evaluate_system(f_strs, vars_current)
            
            # Evaluate J matrix
            J_vals = []
            for row_strs in J_strs:
                J_vals.append(evaluate_system(row_strs, vars_current))
                
        except Exception as e:
            return {"success": False, "message": str(e), "steps": steps}
            
        # We solve J * delta = -F
        neg_F = [-val for val in F_vals]
        
        try:
            delta = solve_linear_system(J_vals, neg_F)
        except ValueError as e:
            return {"success": False, "message": f"Matrix error: {str(e)}", "steps": steps}
            
        error = max(abs(d) for d in delta)
        
        # Calculate new variables
        new_vars = {}
        for idx, k in enumerate(keys):
            new_vars[k] = vars_current[k] + delta[idx]
            
        step_data = {
            "iteration": i,
            "variables": vars_current.copy(),
            "F": F_vals,
            "Jacobian": J_vals,
            "delta": delta,
            "new_variables": new_vars.copy(),
            "error": error
        }
        steps.append(step_data)
        
        vars_current = new_vars
        
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
