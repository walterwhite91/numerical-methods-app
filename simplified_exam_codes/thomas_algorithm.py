def thomas_algorithm(a, b, c, d):
    n = len(d) # Get the size of the system (number of equations)
    
    cp = [0.0] * n # Initialize array to store modified upper diagonal coefficients c'
    dp = [0.0] * n # Initialize array to store modified RHS values d'
    
    # Initialize the first values of c' and d'
    cp[0] = c[0] / b[0]
    dp[0] = d[0] / b[0]
    
    # Forward elimination pass
    for i in range(1, n):
        # Calculate denominator for c' and d' updates
        denom = b[i] - a[i] * cp[i - 1]
        
        # Update upper diagonal coefficient c' (for all but the last equation)
        if i < n - 1:
            cp[i] = c[i] / denom
            
        # Update RHS value d'
        dp[i] = (d[i] - a[i] * dp[i - 1]) / denom
        
    # Back substitution to compute the solution vector x
    x = [0.0] * n # Initialize solution vector x with zeros
    x[-1] = dp[-1] # The last element of x is simply the last element of d'
    for i in range(n - 2, -1, -1): # Iterate backwards from n-2 down to 0
        # Compute the value of x[i] using the relation: x[i] = d'[i] - c'[i] * x[i+1]
        x[i] = dp[i] - cp[i] * x[i + 1]
        
    return x # Return the final solution vector x

# Executable test block
if __name__ == "__main__":
    print("=== Testing Thomas Algorithm ===")
    # System:
    # 2*x0 - x1 = 1
    # -x0 + 2*x1 - x2 = 0
    # -x1 + 2*x2 = 1
    a = [0.0, -1.0, -1.0]
    b_diag = [2.0, 2.0, 2.0]
    c = [-1.0, -1.0, 0.0]
    d = [1.0, 0.0, 1.0]
    x = thomas_algorithm(a, b_diag, c, d)
    print(f"Thomas Algorithm Solution: {x} (expected: [1.0, 1.0, 1.0])")
    print("================================")
