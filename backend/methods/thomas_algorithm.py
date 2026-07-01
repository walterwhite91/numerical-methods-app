from .utils import evaluate_function

def tridiagonal_solver(a, b, c, d):
    """
    Thomas algorithm for Tridiagonal matrix.
    a: lower diagonal (length n-1, prepended with 0 for indexing)
    b: main diagonal (length n)
    c: upper diagonal (length n-1, appended with 0)
    d: rhs vector (length n)
    """
    n = len(d)
    c_prime = [0.0] * n
    d_prime = [0.0] * n
    
    c_prime[0] = c[0] / b[0]
    d_prime[0] = d[0] / b[0]
    
    # Forward elimination
    for i in range(1, n):
        denom = b[i] - a[i]*c_prime[i-1]
        if denom == 0:
            return {"success": False, "message": "Zero denominator encountered."}
        if i < n - 1:
            c_prime[i] = c[i] / denom
        d_prime[i] = (d[i] - a[i]*d_prime[i-1]) / denom
        
    # Back substitution
    x = [0.0] * n
    x[-1] = d_prime[-1]
    for i in range(n - 2, -1, -1):
        x[i] = d_prime[i] - c_prime[i]*x[i+1]
        
    return {
        "success": True,
        "c_prime": c_prime,
        "d_prime": d_prime,
        "x": x
    }
