import math

def forward_difference_table(y_vals):
    n = len(y_vals)
    # Initialize table with zeros
    table = [[0.0 for _ in range(n)] for _ in range(n)]
    
    # Fill first column with y values
    for i in range(n):
        table[i][0] = y_vals[i]
        
    # Compute forward differences column by column
    for j in range(1, n):
        for i in range(n - j):
            table[i][j] = table[i + 1][j - 1] - table[i][j - 1]
            
    return table

def stirling_interpolation(x_vals, y_vals, x):
    n = len(x_vals)
    h = x_vals[1] - x_vals[0] # Assuming equally spaced intervals
    
    # Generate the forward difference table
    table = forward_difference_table(y_vals)
    
    # Find the origin index (closest x_0 to target x)
    origin_idx = min(range(n), key=lambda i: abs(x_vals[i] - x))
    x0 = x_vals[origin_idx]
    
    # Calculate interpolation parameter p
    p = (x - x0) / h
    
    # Initialize Stirling estimate with y_0 (at the origin index)
    interpolated_value = table[origin_idx][0]
    
    # Loop over difference columns (orders)
    for k in range(1, n):
        if k % 2 == 1:
            # Odd order k = 2m + 1
            m = k // 2
            # Check table boundary constraints for required rows
            row1 = origin_idx - m
            row2 = origin_idx - m - 1
            if row1 < 0 or row2 < 0 or row1 >= n - k or row2 >= n - k:
                break # Stop if indices go out of bounds
                
            # Stirling coefficient for odd order: p * (p^2 - 1^2) * ... * (p^2 - m^2) / k!
            coeff = p
            for i in range(1, m + 1):
                coeff *= (p**2 - i**2)
            coeff /= math.factorial(k)
            
            # Average the two adjacent differences
            avg_diff = (table[row1][k] + table[row2][k]) / 2.0
            interpolated_value += coeff * avg_diff
            
        else:
            # Even order k = 2m
            m = k // 2
            row = origin_idx - m
            if row < 0 or row >= n - k:
                break # Stop if index goes out of bounds
                
            # Stirling coefficient for even order: p^2 * (p^2 - 1^2) * ... * (p^2 - (m-1)^2) / k!
            coeff = p**2
            for i in range(1, m):
                coeff *= (p**2 - i**2)
            coeff /= math.factorial(k)
            
            # Add the even difference term
            interpolated_value += coeff * table[row][k]
            
    return interpolated_value

# Executable test block
if __name__ == "__main__":
    print("=== Testing Stirling Central Interpolation ===")
    # Table of values for cos(x)
    x_vals = [0.10, 0.15, 0.20, 0.25, 0.30]
    y_vals = [0.9950, 0.9888, 0.9801, 0.9689, 0.9553]
    
    target = 0.17
    result = stirling_interpolation(x_vals, y_vals, target)
    print(f"Stirling estimation of cos({target}): {result:.6f} (expected: ~0.9856)")
    print("==============================================")
