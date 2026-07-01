import math

def truncation_error(max_derivative_val, n, x, a):
    error_bound = (max_derivative_val / math.factorial(n)) * (abs(x - a) ** n)
    return {"error_bound": error_bound}
