from .utils import evaluate_function

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
