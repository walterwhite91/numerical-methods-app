def lu_decomposition(A, b):
    """
    Solves Ax = b using LU Decomposition.
    Returns L, U matrices, and intermediate y, x vectors.
    """
    n = len(A)
    L = [[0.0] * n for _ in range(n)]
    U = [[0.0] * n for _ in range(n)]
    
    # Decompose A into L and U
    for i in range(n):
        # Upper Triangular
        for k in range(i, n):
            sum_val = sum(L[i][j] * U[j][k] for j in range(i))
            U[i][k] = A[i][k] - sum_val
            
        # Lower Triangular
        for k in range(i, n):
            if i == k:
                L[i][i] = 1.0
            else:
                if U[i][i] == 0:
                    return {"success": False, "message": "Zero on diagonal in U matrix."}
                sum_val = sum(L[k][j] * U[j][i] for j in range(i))
                L[k][i] = (A[k][i] - sum_val) / U[i][i]
                
    # Forward substitution Ly = b
    y = [0.0] * n
    for i in range(n):
        sum_val = sum(L[i][j] * y[j] for j in range(i))
        y[i] = b[i] - sum_val
        
    # Back substitution Ux = y
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        if U[i][i] == 0:
            return {"success": False, "message": "Zero on diagonal in U matrix."}
        sum_val = sum(U[i][j] * x[j] for j in range(i + 1, n))
        x[i] = (y[i] - sum_val) / U[i][i]
        
    return {
        "success": True,
        "L": L,
        "U": U,
        "y": y,
        "x": x
    }

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

def gauss_jacobi(A, b, initial_guess, tol=1e-6, max_iter=100):
    n = len(b)
    x = initial_guess.copy()
    steps = []
    
    for iteration in range(1, max_iter + 1):
        x_new = [0.0] * n
        for i in range(n):
            s = sum(A[i][j] * x[j] for j in range(n) if j != i)
            x_new[i] = (b[i] - s) / A[i][i]
            
        error = max(abs(x_new[i] - x[i]) for i in range(n))
        steps.append({
            "iteration": iteration,
            "x": x.copy(),
            "x_new": x_new.copy(),
            "error": error
        })
        
        x = x_new
        if error < tol:
            return {"success": True, "solution": x, "steps": steps}
            
    return {"success": False, "solution": x, "steps": steps}

def gauss_seidel(A, b, initial_guess, tol=1e-6, max_iter=100):
    n = len(b)
    x = initial_guess.copy()
    steps = []
    
    for iteration in range(1, max_iter + 1):
        x_old = x.copy()
        for i in range(n):
            s = sum(A[i][j] * x[j] for j in range(n) if j != i)
            x[i] = (b[i] - s) / A[i][i]
            
        error = max(abs(x[i] - x_old[i]) for i in range(n))
        steps.append({
            "iteration": iteration,
            "x_old": x_old.copy(),
            "x_new": x.copy(),
            "error": error
        })
        
        if error < tol:
            return {"success": True, "solution": x, "steps": steps}
            
    return {"success": False, "solution": x, "steps": steps}
