def newton_raphson(f, df, x0, tol=1e-6, max_iter=100):
    x = x0 # Set initial guess
    
    # Iterate up to the maximum number of iterations
    for i in range(max_iter):
        fx = f(x) # Evaluate the function at the current point x
        dfx = df(x) # Evaluate the derivative at the current point x
        
        # Avoid division by zero (tangent is parallel to x-axis)
        if dfx == 0:
            raise ValueError("Derivative is zero. Newton-Raphson method fails.")
            
        # Calculate the next estimate using Newton's formula: x_new = x - f(x)/f'(x)
        x_new = x - fx / dfx
        
        # Check if the difference between successive estimates is within tolerance
        if abs(x_new - x) < tol:
            return x_new # Return the converged root
            
        # Update the current point for the next iteration
        x = x_new
        
    return x # Return the best estimate if max_iter is reached

# Executable test block
if __name__ == "__main__":
    print("=== Testing Newton-Raphson Method ===")
    f = lambda x: x**2 - 2
    df = lambda x: 2*x
    root = newton_raphson(f, df, 1.5)
    print(f"Newton-Raphson root of x**2 - 2 with x0=1.5: {root:.6f} (expected: ~1.414214)")
    print("=====================================")
