def backward_difference_table(y_vals):
    n = len(y_vals)
    # Initialize a 2D list with zeros of size n x n
    table = [[0.0 for _ in range(n)] for _ in range(n)]
    
    # Fill the first column with y values
    for i in range(n):
        table[i][0] = y_vals[i]
        
    # Calculate backward differences column by column
    for j in range(1, n):
        # Row index ranges from n-1 down to j
        for i in range(n - 1, j - 1, -1):
            table[i][j] = table[i][j - 1] - table[i - 1][j - 1]
            
    return table

def newton_backward_interpolation(x_vals, y_vals, x):
    n = len(x_vals)
    h = x_vals[1] - x_vals[0] # Calculate step size h (assuming uniform spacing)
    
    # Generate the backward difference table
    table = backward_difference_table(y_vals)
    
    # Calculate interpolation parameter p relative to the last point x_n (index n-1)
    p = (x - x_vals[n - 1]) / h
    
    # Start with the last y value: y_n
    interpolated_value = table[n - 1][0]
    p_term = 1.0
    factorial = 1.0
    
    # Sum the terms: y_n + p * del(y_n) + p*(p+1)/2! * del^2(y_n) + ...
    for j in range(1, n):
        p_term *= (p + j - 1)  # Compute p * (p + 1) * ... * (p + j - 1)
        factorial *= j         # Compute j!
        # Add the j-th term to the result
        interpolated_value += (p_term / factorial) * table[n - 1][j]
        
    return table, interpolated_value

# Executable test block
if __name__ == "__main__":
    print("=== Testing Newton Backward Interpolation ===")
    x_vals = [1.0, 1.2, 1.4, 1.6]
    y_vals = [2.7183, 3.3201, 4.0552, 4.9530]
    
    # Interpolate near the end of the table, e.g., x = 1.5
    target = 1.5
    table, result = newton_backward_interpolation(x_vals, y_vals, target)
    
    print("Backward Difference Table:")
    for i in range(len(y_vals)):
        row_str = " ".join(f"{table[i][j]:.4f}" for j in range(i + 1))
        print(f"Row {i} (x={x_vals[i]}): {row_str}")
        
    print(f"\nInterpolated value at x = {target}: {result:.4f} (expected: ~4.4817)")
    print("=============================================")
