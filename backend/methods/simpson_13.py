from .utils import evaluate_function

def numerical_integration_simpson_13(func_str, a, b, n):
    if n % 2 != 0: return {'success': False, 'message': 'Simpson\'s 1/3 rule requires n to be even.'}
    h = (b - a) / n
    table = []
    for i in range(n + 1):
        x_i = a + i * h
        y_i = evaluate_function(func_str, x_i)
        table.append({"i": i, "x": x_i, "y": y_i})
        
    y0 = table[0]["y"]
    yn = table[-1]["y"]
    
    sum_edges = y0 + yn
    sum_odd = sum(table[i]["y"] for i in range(1, n, 2))
    sum_even = sum(table[i]["y"] for i in range(2, n, 2))
    integral = (h / 3) * (sum_edges + 4 * sum_odd + 2 * sum_even)
    calculation_steps = [
        r"\text{Formula: } I \approx \frac{h}{3} \left[ (y_0 + y_n) + 4 \sum_{\text{odd}} y_i + 2 \sum_{\text{even}} y_i \right]",
        f"I \approx \frac{{{h:.4f}}}{{3}} \left[ ({y0:.4f} + {yn:.4f}) + 4({sum_odd:.4f}) + 2({sum_even:.4f}) \right]",
        f"I \approx {integral:.6f}"
    ]
    
    return {
        "success": True,
        "h": h,
        "table": table,
        "calculation_steps": calculation_steps,
        "integral": integral,
        "method": "simpson_13"
    }
