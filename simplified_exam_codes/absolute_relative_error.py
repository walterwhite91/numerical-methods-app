def calculate_errors(true_val, approx_val):
    # Absolute error: magnitude of difference between true and approximate value
    absolute_error = abs(true_val - approx_val)
    
    # Relative error: absolute error divided by the magnitude of the true value
    # We check if true_val is zero to avoid division by zero
    relative_error = absolute_error / abs(true_val) if true_val != 0 else 0.0
    
    # Percentage error: relative error multiplied by 100 to convert to percentage
    percentage_error = relative_error * 100.0
    
    return absolute_error, relative_error, percentage_error

# Executable test block
if __name__ == "__main__":
    print("=== Testing Absolute, Relative & Percentage Errors ===")
    true_val = 10.0
    approx_val = 9.8
    ea, er, ep = calculate_errors(true_val, approx_val)
    print(f"True value: {true_val}, Approximate value: {approx_val}")
    print(f"Absolute error: {ea} (expected: 0.2)")
    print(f"Relative error: {er} (expected: 0.02)")
    print(f"Percentage error: {ep}% (expected: 2.0%)")
    print("=====================================================")
