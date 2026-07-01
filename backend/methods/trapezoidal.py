from .utils import evaluate_function

def numerical_integration_trapezoidal(func_str, a, b, n):
    
    h = (b - a) / n
    table = []
    for i in range(n + 1):
        x_i = a + i * h
        y_i = evaluate_function(func_str, x_i)
        table.append({"i": i, "x": x_i, "y": y_i})
        
    y0 = table[0]["y"]
    yn = table[-1]["y"]
    
    sum_edges = y0 + yn
    sum_middle = sum(t["y"] for t in table[1:-1])
    integral = (h / 2) * (sum_edges + 2 * sum_middle)
    calculation_steps = [
        r"\text{Formula: } I \approx \frac{h}{2} \left[ (y_0 + y_n) + 2 \sum_{i=1}^{n-1} y_i \right]",
        f"I \approx \frac{{{h:.4f}}}{{2}} \left[ ({y0:.4f} + {yn:.4f}) + 2({sum_middle:.4f}) \right]",
        f"I \approx {integral:.6f}"
    ]
    
    return {
        "success": True,
        "h": h,
        "table": table,
        "calculation_steps": calculation_steps,
        "integral": integral,
        "method": "trapezoidal"
    }
