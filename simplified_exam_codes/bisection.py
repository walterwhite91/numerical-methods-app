def bisection(f, a, b, tol=1e-6, max_iter=100):
    # Check if a root exists in the given interval [a, b]
    # Intermediate Value Theorem requires f(a) and f(b) to have opposite signs
    if f(a) * f(b) >= 0:
        raise ValueError("Root not guaranteed. f(a) and f(b) must have opposite signs.")
        
    # Iterate up to the maximum number of iterations
    for i in range(max_iter):
        # Find the midpoint (c) of the current interval [a, b]
        c = (a + b) / 2.0
        
        # Check if we have met the tolerance limit or if c is an exact root
        if abs(b - a) / 2.0 < tol or f(c) == 0:
            return c # Return the computed root
            
        # Decide which subinterval contains the root
        if f(a) * f(c) < 0:
            b = c # The root lies in the left subinterval [a, c], so update upper bound
        else:
            a = c # The root lies in the right subinterval [c, b], so update lower bound
            
    return (a + b) / 2.0 # Return the best estimate if max_iter is reached

# Executable test block
if __name__ == "__main__":
    print("=== Testing Bisection Method ===")
    f = lambda x: x**2 - 2
    root = bisection(f, 1, 2)
    print(f"Bisection root of x**2 - 2 in [1, 2]: {root:.6f} (expected: ~1.414214)")
    print("================================")
