def forward_difference_table(x, y):
    n = len(y) # Get the number of data points
    
    # Initialize a 2D table of size n x n with zeros
    table = [[0.0 for _ in range(n)] for _ in range(n)]
    
    # Fill the first column of the table with y values (0th difference column)
    for i in range(n):
        table[i][0] = y[i]
        
    # Build the difference table column by column (1st difference up to (n-1)th difference)
    for j in range(1, n):
        for i in range(n - j):
            # Difference is the value below-left minus value current-left
            table[i][j] = table[i + 1][j - 1] - table[i][j - 1]
            
    return table # Return the complete difference table


def newton_forward_interpolation(x, y, target):
    n = len(x) # Get number of data points
    table = forward_difference_table(x, y) # Generate the forward difference table
    
    h = x[1] - x[0] # Calculate equal spacing interval h between x values
    u = (target - x[0]) / h # Calculate the normalized variable u for target interpolation point
    
    result = table[0][0] # Start with the first term of the formula (y0)
    u_term = 1.0 # Initialize variable to keep track of u product terms: u * (u-1) * (u-2)...
    fact = 1 # Initialize variable for factorial values: i!
    
    # Calculate terms for Newton's forward interpolation formula
    for i in range(1, n):
        u_term = u_term * (u - (i - 1)) # Compute u * (u - 1) * ... * (u - i + 1)
        fact = fact * i # Compute factorial of i: i!
        # Add term: (u_term / i!) * Delta^i y0
        result = result + (u_term / fact) * table[0][i]
        
    return result # Return the final interpolated value

# Executable test block for finite differences
if __name__ == "__main__":
    print("=== Testing Finite Difference & Interpolation ===")
    
    # Data points for y = 2**x + x**2
    x_pts = [0.0, 1.0, 2.0]
    y_pts = [1.0, 3.0, 9.0] 
    
    # 1. Forward Difference Table
    print("\nData points:")
    for xi, yi in zip(x_pts, y_pts):
        print(f"x = {xi}, y = {yi}")
        
    table = forward_difference_table(x_pts, y_pts)
    print("\nForward Difference Table:")
    for idx, row in enumerate(table):
        # Print only the valid difference columns for each row
        print(f"Row {idx}: {[round(val, 4) for val in row[:len(table)-idx]]}")
        
    # 2. Newton's Forward Interpolation
    target = 1.5
    y_interp = newton_forward_interpolation(x_pts, y_pts, target)
    print(f"\nNewton Forward Interpolated Value at x = {target}: {y_interp} (expected: 5.5)")
    print("================================================")
