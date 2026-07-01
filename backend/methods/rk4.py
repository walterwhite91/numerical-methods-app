from .utils import evaluate_function, evaluate_system

def runge_kutta_4(func_str, x0, y0, h, steps_count):
    """
    Runge-Kutta 4th Order Method
    """
    steps = []
    x = x0
    y = y0
    
    for i in range(steps_count):
        try:
            k1 = h * evaluate_system([func_str], {'x': x, 'y': y})[0]
            k2 = h * evaluate_system([func_str], {'x': x + h/2, 'y': y + k1/2})[0]
            k3 = h * evaluate_system([func_str], {'x': x + h/2, 'y': y + k2/2})[0]
            k4 = h * evaluate_system([func_str], {'x': x + h, 'y': y + k3})[0]
        except Exception as e:
            return {"success": False, "message": str(e), "steps": steps}
            
        y_next = y + (k1 + 2*k2 + 2*k3 + k4) / 6
        x_next = x + h
        
        step_data = {
            "iteration": i,
            "x": x,
            "y": y,
            "k1": k1,
            "k2": k2,
            "k3": k3,
            "k4": k4,
            "y_next": y_next
        }
        steps.append(step_data)
        
        y = y_next
        x = x_next
        
    return {
        "success": True,
        "steps": steps,
        "final_x": x,
        "final_y": y
    }
