from .utils import evaluate_function

def numerical_integration(func_str, a, b, n, method="trapezoidal"):
    """
    Solves numerical integration.
    methods: 'trapezoidal', 'simpson_13', 'simpson_38'
    n: number of subintervals
    """
    if method == "simpson_13" and n % 2 != 0:
        return {"success": False, "message": "Simpson's 1/3 rule requires 'n' to be even."}
    if method == "simpson_38" and n % 3 != 0:
        return {"success": False, "message": "Simpson's 3/8 rule requires 'n' to be a multiple of 3."}
        
    h = (b - a) / n
    steps = []
    
    # Generate table of values
    table = []
    for i in range(n + 1):
        x_i = a + i * h
        try:
            y_i = evaluate_function(func_str, x_i)
        except Exception as e:
            return {"success": False, "message": str(e)}
        table.append({"i": i, "x": x_i, "y": y_i})
        
    # Calculate integration
    integral = 0
    calculation_steps = []
    
    y0 = table[0]["y"]
    yn = table[-1]["y"]
    
    if method == "trapezoidal":
        sum_edges = y0 + yn
        sum_middle = sum(t["y"] for t in table[1:-1])
        integral = (h / 2) * (sum_edges + 2 * sum_middle)
        calculation_steps = [
            r"\text{Formula: } I \approx \frac{h}{2} \left[ (y_0 + y_n) + 2 \sum_{i=1}^{n-1} y_i \right]",
            f"I \\approx \\frac{{{h:.4f}}}{{2}} \\left[ ({y0:.4f} + {yn:.4f}) + 2({sum_middle:.4f}) \\right]",
            f"I \\approx {integral:.6f}"
        ]
        
    elif method == "simpson_13":
        sum_edges = y0 + yn
        sum_odd = sum(table[i]["y"] for i in range(1, n, 2))
        sum_even = sum(table[i]["y"] for i in range(2, n, 2))
        integral = (h / 3) * (sum_edges + 4 * sum_odd + 2 * sum_even)
        calculation_steps = [
            r"\text{Formula: } I \approx \frac{h}{3} \left[ (y_0 + y_n) + 4 \sum_{\text{odd}} y_i + 2 \sum_{\text{even}} y_i \right]",
            f"I \\approx \\frac{{{h:.4f}}}{{3}} \\left[ ({y0:.4f} + {yn:.4f}) + 4({sum_odd:.4f}) + 2({sum_even:.4f}) \\right]",
            f"I \\approx {integral:.6f}"
        ]
        
    elif method == "simpson_38":
        sum_edges = y0 + yn
        sum_mult3 = sum(table[i]["y"] for i in range(3, n, 3))
        sum_rest = sum(table[i]["y"] for i in range(1, n) if i % 3 != 0)
        integral = (3 * h / 8) * (sum_edges + 3 * sum_rest + 2 * sum_mult3)
        calculation_steps = [
            r"\text{Formula: } I \approx \frac{3h}{8} \left[ (y_0 + y_n) + 3 \sum_{i \neq 3k} y_i + 2 \sum_{i=3, 6...} y_i \right]",
            f"I \\approx \\frac{{3 \\cdot {h:.4f}}}{{8}} \\left[ ({y0:.4f} + {yn:.4f}) + 3({sum_rest:.4f}) + 2({sum_mult3:.4f}) \\right]",
            f"I \\approx {integral:.6f}"
        ]
        
    return {
        "success": True,
        "h": h,
        "table": table,
        "calculation_steps": calculation_steps,
        "integral": integral,
        "method": method
    }
