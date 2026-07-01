def secant(f, x0, x1, tol=1e-6, max_iter=100):
    # Iterate up to the maximum number of iterations
    for i in range(max_iter):
        fx0 = f(x0) # Evaluate function at x0
        fx1 = f(x1) # Evaluate function at x1
        
        # Avoid division by zero when function values are identical
        if fx1 - fx0 == 0:
            raise ValueError("Division by zero. Secant method fails.")
            
        # Calculate the next estimate using the Secant formula
        x_next = x1 - fx1 * (x1 - x0) / (fx1 - fx0)
        
        # Check if the difference between successive estimates is within tolerance
        if abs(x_next - x1) < tol:
            return x_next # Return the converged root
            
        # Update the previous two points for the next iteration
        x0 = x1
        x1 = x_next
        
    return x1 # Return the best estimate if max_iter is reached

# Executable test block
if __name__ == "__main__":
    print("=== Testing Secant Method ===")
    f = lambda x: x**2 - 2
    root = secant(f, 1.0, 2.0)
    print(f"Secant root of x**2 - 2 with guesses 1.0 & 2.0: {root:.6f} (expected: ~1.414214)")
    print("=============================")
