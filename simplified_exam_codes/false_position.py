def false_position(f, a, b, tol=1e-6, max_iter=100):
    # Check if a root exists in the given interval [a, b]
    # Intermediate Value Theorem requires f(a) and f(b) to have opposite signs
    if f(a) * f(b) >= 0:
        raise ValueError("Root not guaranteed. f(a) and f(b) must have opposite signs.")
        
    fa = f(a)
    fb = f(b)
    c = a # Initialize c
    
    # Iterate up to the maximum number of iterations
    for i in range(max_iter):
        # Calculate the false position midpoint c using the formula:
        # c = (a * f(b) - b * f(a)) / (f(b) - f(a))
        c = (a * fb - b * fa) / (fb - fa)
        fc = f(c)
        
        # Check if we have met the tolerance limit or if c is an exact root
        if abs(fc) < tol or fc == 0:
            return c # Return the computed root
            
        # Decide which subinterval contains the root and update the bounds
        if fa * fc < 0:
            b = c # Root lies in [a, c]
            fb = fc
        else:
            a = c # Root lies in [c, b]
            fa = fc
            
    return c # Return the best estimate if max_iter is reached

# Executable test block
if __name__ == "__main__":
    print("=== Testing False Position Method ===")
    f = lambda x: x**2 - 2
    root = false_position(f, 1.0, 2.0)
    print(f"False Position root of x**2 - 2 in [1, 2]: {root:.6f} (expected: ~1.414214)")
    print("=====================================")
