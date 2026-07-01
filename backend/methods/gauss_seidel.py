from .utils import evaluate_function

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
