import math

def truncation_error_bound(max_deriv, n, x, a):
    # Formula for maximum truncation error bound of nth degree Taylor polynomial:
    # Error <= (M / n!) * |x - a|^n
    # where M is the maximum value of the nth derivative on the interval [a, x]
    
    # Compute n factorial (n!)
    fact = math.factorial(n)
    
    # Compute |x - a|^n
    diff_pow = abs(x - a) ** n
    
    # Calculate the upper bound of the truncation error
    error_bound = (max_deriv / fact) * diff_pow
    
    return error_bound

# Executable test block
if __name__ == "__main__":
    print("=== Testing Truncation Error Bound ===")
    max_deriv = 2.0
    n = 3
    x = 1.1
    x0 = 1.0
    err_bound = truncation_error_bound(max_deriv, n, x, x0)
    print(f"Truncation error bound (n={n}, dx={x-x0:.2f}, max_deriv={max_deriv}):")
    print(f"Bound = {err_bound} (expected: ~0.000333)")
    print("======================================")
