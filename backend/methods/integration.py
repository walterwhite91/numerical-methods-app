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
    
    if method == "trapezoidal":
        sum_edges = table[0]["y"] + table[-1]["y"]
        sum_middle = sum(t["y"] for t in table[1:-1])
        integral = (h / 2) * (sum_edges + 2 * sum_middle)
        calculation_steps = [
            f"h/2 * [ (y0 + yn) + 2*(y1 + y2 + ... + yn-1) ]",
            f"{h/2} * [ ({table[0]['y']} + {table[-1]['y']}) + 2*({sum_middle}) ]"
        ]
        
    elif method == "simpson_13":
        sum_edges = table[0]["y"] + table[-1]["y"]
        sum_odd = sum(table[i]["y"] for i in range(1, n, 2))
        sum_even = sum(table[i]["y"] for i in range(2, n, 2))
        integral = (h / 3) * (sum_edges + 4 * sum_odd + 2 * sum_even)
        calculation_steps = [
            f"h/3 * [ (y0 + yn) + 4*(Odd y) + 2*(Even y) ]",
            f"{h/3} * [ ({table[0]['y']} + {table[-1]['y']}) + 4*({sum_odd}) + 2*({sum_even}) ]"
        ]
        
    elif method == "simpson_38":
        sum_edges = table[0]["y"] + table[-1]["y"]
        sum_mult3 = sum(table[i]["y"] for i in range(3, n, 3))
        sum_rest = sum(table[i]["y"] for i in range(1, n) if i % 3 != 0)
        integral = (3 * h / 8) * (sum_edges + 3 * sum_rest + 2 * sum_mult3)
        calculation_steps = [
            f"3h/8 * [ (y0 + yn) + 3*(Non-multiples of 3 y) + 2*(Multiples of 3 y) ]",
            f"{3*h/8} * [ ({table[0]['y']} + {table[-1]['y']}) + 3*({sum_rest}) + 2*({sum_mult3}) ]"
        ]
        
    return {
        "success": True,
        "h": h,
        "table": table,
        "calculation_steps": calculation_steps,
        "integral": integral,
        "method": method
    }
