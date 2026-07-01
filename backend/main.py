from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from methods.bisection import bisection_method
from methods.secant import secant_method
from methods.false_position import false_position_method
from methods.newton_raphson import newton_raphson_method
from methods.generalized_newton import generalized_newton_method
from methods.iteration_system import iteration_method_system
from methods.newton_system import newton_raphson_system
from methods.forward_difference import generate_difference_table, evaluate_formula_forward
from methods.backward_difference import evaluate_formula_backward
from methods.euler import euler_method
from methods.modified_euler import modified_euler_method
from methods.rk4 import runge_kutta_4
from methods.trapezoidal import numerical_integration_trapezoidal
from methods.simpson_13 import numerical_integration_simpson_13
from methods.simpson_38 import numerical_integration_simpson_38
from methods.lu_decomposition import lu_decomposition
from methods.thomas_algorithm import tridiagonal_solver
from methods.gauss_jacobi import gauss_jacobi
from methods.gauss_seidel import gauss_seidel
from methods.absolute_relative_error import absolute_relative_error
from methods.truncation_error import truncation_error
from methods.past_qna import get_all_questions, get_chapters_summary
from methods.solver_params_extractor import extract_solver_params

app = FastAPI(title="Numerical Methods API", description="Educational API for numerical methods — MCSC 202")

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
    a: Optional[float] = None
    b: Optional[float] = None
    x0: Optional[float] = None
    x1: Optional[float] = None
    tol: float = 1e-6
    max_iter: int = 100
    multiplicity: Optional[int] = 1   # for generalised Newton-Raphson (MCSC-202)

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
    return generalized_newton_method(
        req.func_str, req.deriv_str, req.x0,
        multiplicity=req.multiplicity or 1,
        tol=req.tol, max_iter=req.max_iter
    )

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
    if req.method == "trapezoidal":
        return numerical_integration_trapezoidal(req.func_str, req.a, req.b, req.n)
    elif req.method == "simpson_13":
        return numerical_integration_simpson_13(req.func_str, req.a, req.b, req.n)
    elif req.method == "simpson_38":
        return numerical_integration_simpson_38(req.func_str, req.a, req.b, req.n)
    else:
        return {"success": False, "message": "Unknown integration method"}


# ─── Past Q&As ────────────────────────────────────────────────────────────────

@app.get("/api/past-qna/chapters")
def list_chapters():
    """Return all chapter names with question counts and icons."""
    return {"success": True, "chapters": get_chapters_summary()}


@app.get("/api/past-qna")
def list_questions(chapter: Optional[str] = Query(default=None, description="Filter by chapter name")):
    """Return all past exam questions, optionally filtered by chapter."""
    questions = get_all_questions(chapter=chapter)
    return {
        "success": True,
        "total": len(questions),
        "chapter_filter": chapter,
        "questions": questions,
    }


@app.get("/api/past-qna/{question_id}/solver-params")
def get_solver_params(question_id: int):
    """
    Extract pre-filled solver parameters from a specific past exam question.
    Returns a dict of params ready to be passed to the solver frontend.
    """
    all_qs = get_all_questions()
    # question_id is the original index
    matches = [q for q in all_qs if q["id"] == question_id]
    if not matches:
        return {"success": False, "message": f"Question {question_id} not found."}

    q = matches[0]
    if not q.get("solvable") or not q.get("solver_method"):
        return {"success": False, "message": "This question is not linked to a solver method."}

    params = extract_solver_params(q["question"], q["solver_method"])
    return {
        "success": True,
        "question_id": question_id,
        "solver_method": q["solver_method"],
        "solver_category": q["solver_category"],
        "params": params,
    }
