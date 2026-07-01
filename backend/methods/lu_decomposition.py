from .utils import evaluate_function

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
