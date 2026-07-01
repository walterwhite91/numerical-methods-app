from .utils import evaluate_function, evaluate_system

def modified_euler_method(func_str, x0, y0, h, steps_count):
    """
    Modified Euler Method (Predictor-Corrector)
    """
    steps = []
    x = x0
    y = y0
    
    for i in range(steps_count):
        try:
            f_xy = evaluate_system([func_str], {'x': x, 'y': y})[0]
            # Predictor
            y_predict = y + h * f_xy
            x_next = x + h
            f_xnext_ypredict = evaluate_system([func_str], {'x': x_next, 'y': y_predict})[0]
            
            # Corrector
            y_correct = y + (h / 2) * (f_xy + f_xnext_ypredict)
        except Exception as e:
            return {"success": False, "message": str(e), "steps": steps}
            
        step_data = {
            "iteration": i,
            "x": x,
            "y": y,
            "f_xy": f_xy,
            "y_predict": y_predict,
            "f_xnext_ypredict": f_xnext_ypredict,
            "y_correct": y_correct
        }
        steps.append(step_data)
        
        y = y_correct
        x = x_next
        
    return {
        "success": True,
        "steps": steps,
        "final_x": x,
        "final_y": y
    }
