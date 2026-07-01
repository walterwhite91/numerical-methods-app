from .utils import evaluate_function, evaluate_system

def euler_method(func_str, x0, y0, h, steps_count):
    """
    Euler's Method for ODEs: y' = f(x, y)
    func_str: string representation of f(x, y) e.g., 'x + y'
    """
    steps = []
    x = x0
    y = y0
    
    for i in range(steps_count + 1):
        # We need a custom evaluate for 2 variables
        try:
            f_xy = evaluate_system([func_str], {'x': x, 'y': y})[0]
        except Exception as e:
            return {"success": False, "message": str(e), "steps": steps}
            
        step_data = {
            "iteration": i,
            "x": x,
            "y": y,
            "slope": f_xy,
            "dy": h * f_xy
        }
        steps.append(step_data)
        
        y = y + h * f_xy
        x = x + h
        
    return {
        "success": True,
        "steps": steps,
        "final_x": x - h,
        "final_y": y - h * steps[-1]['slope']
    }
