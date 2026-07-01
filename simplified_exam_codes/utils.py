# Import the math module to use mathematical functions like sin, cos, exp, log
import math

def evaluate(func_str, x_val):
    # Create a dictionary of allowed mathematical functions from the math module
    # k: v creates key-value pairs (e.g. 'sin': math.sin) for non-private math members
    math_env = {k: v for k, v in math.__dict__.items() if not k.startswith("__")}
    
    # Add 'x' to the environment, pointing it to the current value of x_val
    math_env["x"] = x_val
    
    # Safely evaluate the mathematical expression string func_str
    # {"__builtins__": {}} blocks access to standard built-in functions (like open, import)
    # math_env serves as the namespace containing local variables (x) and math library functions
    return eval(func_str, {"__builtins__": {}}, math_env)

# Executable test block for utils
if __name__ == "__main__":
    print("=== Testing Utility Evaluator ===")
    val = evaluate("x**2 + sin(x)", 0)
    print(f"evaluate('x**2 + sin(x)', 0) = {val} (expected: 0.0)")
    
    val2 = evaluate("cos(x) + exp(x)", 0)
    print(f"evaluate('cos(x) + exp(x)', 0) = {val2} (expected: 2.0)")
    print("================================")
