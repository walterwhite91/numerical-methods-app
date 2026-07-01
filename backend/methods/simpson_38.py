from .utils import evaluate_function

def numerical_integration_simpson_38(func_str, a, b, n):
    if n % 3 != 0: return {'success': False, 'message': 'Simpson\'s 3/8 rule requires n to be a multiple of 3.'}
    h = (b - a) / n
    table = []
    for i in range(n + 1):
        x_i = a + i * h
        y_i = evaluate_function(func_str, x_i)
        table.append({"i": i, "x": x_i, "y": y_i})
        
    y0 = table[0]["y"]
    yn = table[-1]["y"]
    
    sum_edges = y0 + yn
    sum_mult3 = sum(table[i]["y"] for i in range(3, n, 3))
    sum_rest = sum(table[i]["y"] for i in range(1, n) if i % 3 != 0)
    integral = (3 * h / 8) * (sum_edges + 3 * sum_rest + 2 * sum_mult3)
    calculation_steps = [
        r"\text{Formula: } I \approx \frac{3h}{8} \left[ (y_0 + y_n) + 3 \sum_{i \neq 3k} y_i + 2 \sum_{i=3, 6...} y_i \right]",
        f"I \approx \frac{{3 \cdot {h:.4f}}}{{8}} \left[ ({y0:.4f} + {yn:.4f}) + 3({sum_rest:.4f}) + 2({sum_mult3:.4f}) \right]",
        f"I \approx {integral:.6f}"
    ]
    
    return {
        "success": True,
        "h": h,
        "table": table,
        "calculation_steps": calculation_steps,
        "integral": integral,
        "method": "simpson_38"
    }
