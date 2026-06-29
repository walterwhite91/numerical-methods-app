from .utils import evaluate_system, evaluate_function
import math

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
