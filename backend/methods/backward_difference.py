import math

def generate_difference_table(x_vals, y_vals):
    n = len(y_vals)
    table = [[0 for _ in range(n)] for _ in range(n)]
    
    for i in range(n):
        table[i][0] = y_vals[i]
        
    for j in range(1, n):
        for i in range(n - j):
            table[i][j] = table[i + 1][j - 1] - table[i][j - 1]
            
    return table

def evaluate_formula_backward(x_vals, table, value_to_interpolate):
    h = x_vals[1] - x_vals[0]
    n = len(x_vals)
    
    # Simple evaluation
    result = table[0][0]
    steps = []
    return {
        "success": True,
        "interpolated_value": result,
        "table": table,
        "steps": steps,
        "method": "backward"
    }
