import math

def evaluate_function(func_str, x_val):
    """
    Evaluates a mathematical function safely using a restricted namespace.
    func_str: string representation of the function (e.g., 'x**3 - x - 1')
    x_val: the value to substitute for 'x'
    """
    allowed_names = {
        k: v for k, v in math.__dict__.items() if not k.startswith("__")
    }
    allowed_names["x"] = x_val
    try:
        # Evaluate the mathematical expression
        result = eval(func_str, {"__builtins__": {}}, allowed_names)
        return float(result)
    except Exception as e:
        raise ValueError(f"Error evaluating function '{func_str}' with x={x_val}: {str(e)}")

def evaluate_system(func_strs, vars_dict):
    """
    Evaluates a system of mathematical equations.
    func_strs: list of string representations of equations
    vars_dict: dictionary of variable values e.g., {'x': 1, 'y': 2}
    """
    allowed_names = {
        k: v for k, v in math.__dict__.items() if not k.startswith("__")
    }
    allowed_names.update(vars_dict)
    
    results = []
    for func_str in func_strs:
        try:
            res = eval(func_str, {"__builtins__": {}}, allowed_names)
            results.append(float(res))
        except Exception as e:
            raise ValueError(f"Error evaluating function '{func_str}' with vars {vars_dict}: {str(e)}")
    return results

def solve_linear_system(A, b):
    """
    Solves Ax = b using Gaussian Elimination with partial pivoting.
    A is a list of lists (matrix).
    b is a list (vector).
    Returns x as a list.
    """
    n = len(b)
    # Augment matrix
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    
    for i in range(n):
        # Partial pivoting
        max_row = max(range(i, n), key=lambda r: abs(M[r][i]))
        M[i], M[max_row] = M[max_row], M[i]
        
        if M[i][i] == 0:
            raise ValueError("Matrix is singular.")
            
        # Eliminate
        for j in range(i + 1, n):
            factor = M[j][i] / M[i][i]
            for k in range(i, n + 1):
                M[j][k] -= factor * M[i][k]
                
    # Back substitution
    x = [0] * n
    for i in range(n - 1, -1, -1):
        s = sum(M[i][j] * x[j] for j in range(i + 1, n))
        x[i] = (M[i][n] - s) / M[i][i]
        
    return x
