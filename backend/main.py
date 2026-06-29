from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from methods.bisection import bisection_method
from methods.secant import secant_method
from methods.false_position import false_position_method
from methods.newton_raphson import newton_raphson_method
from methods.generalized_newton import generalized_newton_method
from methods.nonlinear_system import iteration_method_system, newton_raphson_system
from methods.interpolation import generate_difference_table, evaluate_formula_from_table
from methods.ode import euler_method, modified_euler_method, runge_kutta_4
from methods.integration import numerical_integration
from methods.linear_system import lu_decomposition, tridiagonal_solver, gauss_jacobi, gauss_seidel

app = FastAPI(title="Numerical Methods API", description="Educational API for numerical methods")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RootRequest(BaseModel):
    func_str: str
    deriv_str: Optional[str] = None
    deriv2_str: Optional[str] = None
    a: Optional[float] = None
    b: Optional[float] = None
    x0: Optional[float] = None
    x1: Optional[float] = None
    tol: float = 1e-6
    max_iter: int = 100

@app.post("/api/root-finding/bisection")
def solve_bisection(req: RootRequest):
    return bisection_method(req.func_str, req.a, req.b, req.tol, req.max_iter)

@app.post("/api/root-finding/secant")
def solve_secant(req: RootRequest):
    return secant_method(req.func_str, req.x0, req.x1, req.tol, req.max_iter)

@app.post("/api/root-finding/false-position")
def solve_false_position(req: RootRequest):
    return false_position_method(req.func_str, req.a, req.b, req.tol, req.max_iter)

@app.post("/api/root-finding/newton-raphson")
def solve_newton_raphson(req: RootRequest):
    return newton_raphson_method(req.func_str, req.deriv_str, req.x0, req.tol, req.max_iter)

@app.post("/api/root-finding/generalized-newton")
def solve_generalized_newton(req: RootRequest):
    return generalized_newton_method(req.func_str, req.deriv_str, req.deriv2_str, req.x0, req.tol, req.max_iter)

class ODERequest(BaseModel):
    func_str: str
    x0: float
    y0: float
    h: float
    steps_count: int

@app.post("/api/ode/euler")
def solve_euler(req: ODERequest):
    return euler_method(req.func_str, req.x0, req.y0, req.h, req.steps_count)

@app.post("/api/ode/modified-euler")
def solve_modified_euler(req: ODERequest):
    return modified_euler_method(req.func_str, req.x0, req.y0, req.h, req.steps_count)

@app.post("/api/ode/rk4")
def solve_rk4(req: ODERequest):
    return runge_kutta_4(req.func_str, req.x0, req.y0, req.h, req.steps_count)

class IntegrationRequest(BaseModel):
    func_str: str
    a: float
    b: float
    n: int
    method: str

@app.post("/api/integration")
def solve_integration(req: IntegrationRequest):
    return numerical_integration(req.func_str, req.a, req.b, req.n, req.method)
