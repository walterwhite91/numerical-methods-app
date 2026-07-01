def lu_decomposition(A, b):
    n = len(A) # Get the size of the matrix A (number of rows/columns)
    
    # Initialize L as an identity matrix (1s on diagonal, 0s elsewhere)
    L = [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]
    # Initialize U as a zero matrix of size n x n
    U = [[0.0 for _ in range(n)] for _ in range(n)]
    
    # LU Decomposition (Doolittle's Algorithm)
    for i in range(n):
        # Calculate elements of the Upper triangular matrix U
        for k in range(i, n):
            # U[i][k] = A[i][k] - sum_{j=0}^{i-1} (L[i][j] * U[j][k])
            sum_val = sum(L[i][j] * U[j][k] for j in range(i))
            U[i][k] = A[i][k] - sum_val
            
        # Calculate elements of the Lower triangular matrix L
        for k in range(i + 1, n):
            # L[k][i] = (A[k][i] - sum_{j=0}^{i-1} (L[k][j] * U[j][i])) / U[i][i]
            sum_val = sum(L[k][j] * U[j][i] for j in range(i))
            L[k][i] = (A[k][i] - sum_val) / U[i][i]
            
    # Forward Substitution to solve Ly = b
    y = [0.0] * n # Initialize vector y with zeros
    for i in range(n):
        # y[i] = b[i] - sum_{j=0}^{i-1} (L[i][j] * y[j])
        sum_val = sum(L[i][j] * y[j] for j in range(i))
        y[i] = b[i] - sum_val
        
    # Back Substitution to solve Ux = y
    x = [0.0] * n # Initialize solution vector x with zeros
    for i in range(n - 1, -1, -1): # Iterate backwards from n-1 down to 0
        # x[i] = (y[i] - sum_{j=i+1}^{n-1} (U[i][j] * x[j])) / U[i][i]
        sum_val = sum(U[i][j] * x[j] for j in range(i + 1, n))
        x[i] = (y[i] - sum_val) / U[i][i]
        
    return L, U, x # Return L, U matrices and the solution vector x

# Executable test block
if __name__ == "__main__":
    print("=== Testing LU Decomposition ===")
    A = [[2.0, -1.0, 0.0], 
         [-1.0, 2.0, -1.0], 
         [0.0, -1.0, 2.0]]
    b = [1.0, 0.0, 1.0]
    L, U, x = lu_decomposition(A, b)
    print("Matrix A:")
    for row in A:
        print(row)
    print("Vector b:", b)
    print("L matrix:")
    for row in L:
        print([round(val, 4) for val in row])
    print("U matrix:")
    for row in U:
        print([round(val, 4) for val in row])
    print(f"Solution x: {x} (expected: [1.0, 1.0, 1.0])")
    print("================================")
