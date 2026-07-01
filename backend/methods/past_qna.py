"""
past_qna.py  –  Serves past MCSC-202 exam Q&As from the JSONL source file.

The loader parses the file once at import time, enriches each question with:
  • chapter → solver mapping (solvable flag, method, category)
  • a sequential id per chapter

The endpoint supports:
  GET /api/past-qna                  → all questions (grouped by chapter)
  GET /api/past-qna?chapter=<name>   → only that chapter
  GET /api/past-qna/chapters         → list of chapters with counts
"""

import json
import os
from pathlib import Path

# ─── Path to the source JSONL file ───────────────────────────────────────────
_ROOT = Path(__file__).resolve().parents[2]          # repo root
_QNA_FILE = _ROOT / "Past Question" / "MCSC_207 Expanded with answers"

# ─── Chapter → solver mapping ─────────────────────────────────────────────────
_SUB_CHAPTER_SOLVER_MAP: dict[str, dict] = {
    # Root Finding
    "Bisection (half-interval) method":            {"solvable": True,  "solver_method": "bisection",        "solver_category": "root-finding"},
    "Newton-Raphson method":                        {"solvable": True,  "solver_method": "newton-raphson",   "solver_category": "root-finding"},
    "Secant method":                                {"solvable": True,  "solver_method": "secant",           "solver_category": "root-finding"},
    "False position":                               {"solvable": True,  "solver_method": "false-position",   "solver_category": "root-finding"},
    "Fixed point iteration":                        {"solvable": True,  "solver_method": "false-position",   "solver_category": "root-finding"},
    "Errors in numerical calculations":             {"solvable": False, "solver_method": None,               "solver_category": "error-detection"},
    # Linear Systems
    "LU decomposition":                             {"solvable": True,  "solver_method": "lu-decomposition", "solver_category": "linear-systems"},
    "Gauss-Seidel iterative method":               {"solvable": True,  "solver_method": "gauss-seidel",     "solver_category": "linear-systems"},
    "Jacobi iterative method":                      {"solvable": True,  "solver_method": "gauss-jacobi",     "solver_category": "linear-systems"},
    "Thomas algorithm":                             {"solvable": True,  "solver_method": "thomas-algorithm", "solver_category": "linear-systems"},
    # ODEs
    "Euler's method":                               {"solvable": True,  "solver_method": "euler",            "solver_category": "ode"},
    "Runge-Kutta fourth-order method":              {"solvable": True,  "solver_method": "rk4",              "solver_category": "ode"},
    "Initial value problems":                       {"solvable": True,  "solver_method": "euler",            "solver_category": "ode"},
    "Finite difference method":                     {"solvable": False, "solver_method": None,               "solver_category": None},
    "Boundary value problems":                      {"solvable": False, "solver_method": None,               "solver_category": None},
    # Integration
    "Simpson's 1/3 rule":                           {"solvable": True,  "solver_method": "simpson-13",       "solver_category": "integration"},
    "Trapezoidal rule (simple and composite)":      {"solvable": True,  "solver_method": "trapezoidal",      "solver_category": "integration"},
    "Numerical differentiation techniques":         {"solvable": False, "solver_method": None,               "solver_category": None},
    # Interpolation
    "Newton's forward and backward difference interpolation": {"solvable": True, "solver_method": "forward-difference", "solver_category": "finite-differences"},
    "Newton's divided difference interpolation":    {"solvable": False, "solver_method": None,               "solver_category": None},
    "Lagrange's interpolation":                     {"solvable": False, "solver_method": None,               "solver_category": None},
    "Linear regression":                            {"solvable": False, "solver_method": None,               "solver_category": None},
    "Least squares method":                         {"solvable": False, "solver_method": None,               "solver_category": None},
}

CHAPTER_ORDER = [
    "Solution of Nonlinear Equations",
    "System of Linear Algebraic Equations",
    "Interpolation and Regression",
    "Numerical Differentiation and Integration",
    "Solution of Ordinary Differential Equations",
    "Solution of Partial Differential Equations",
]

CHAPTER_ICONS = {
    "Solution of Nonlinear Equations":              "🎯",
    "System of Linear Algebraic Equations":         "🔢",
    "Interpolation and Regression":                 "📈",
    "Numerical Differentiation and Integration":    "∫",
    "Solution of Ordinary Differential Equations": "📐",
    "Solution of Partial Differential Equations":  "🌊",
}


def _resolve_solver(sub_chapter: str) -> dict:
    """Match sub_chapter string against our mapping keys (partial match)."""
    for key, meta in _SUB_CHAPTER_SOLVER_MAP.items():
        if key in sub_chapter or sub_chapter in key:
            return meta
    return {"solvable": False, "solver_method": None, "solver_category": None}


def _load_questions() -> list[dict]:
    """Parse JSONL file and enrich each question. Runs once at startup."""
    if not _QNA_FILE.exists():
        raise FileNotFoundError(f"Past Q&A file not found at: {_QNA_FILE}")

    questions = []
    with open(_QNA_FILE, encoding="utf-8") as f:
        for idx, line in enumerate(f):
            line = line.strip()
            if not line:
                continue
            try:
                q = json.loads(line)
            except json.JSONDecodeError as e:
                # Skip malformed lines but surface warning
                print(f"[past_qna] Skipping malformed line {idx+1}: {e}")
                continue

            sub = q.get("sub_chapter", "")
            solver_meta = _resolve_solver(sub)

            questions.append({
                "id":                  idx,
                "subject":             q.get("subject", ""),
                "question":            q.get("question", ""),
                "marks":               q.get("marks", 0),
                "options":             q.get("options", []),
                "exam_mode_answer":    q.get("exam_mode_answer", ""),
                "guided_mode_answer":  q.get("guided_mode_answer", None),
                "chapter":             q.get("chapter", ""),
                "sub_chapter":         sub,
                "solvable":            solver_meta["solvable"],
                "solver_method":       solver_meta["solver_method"],
                "solver_category":     solver_meta["solver_category"],
            })

    return questions


# Load once at module import time (cached for the process lifetime)
_ALL_QUESTIONS: list[dict] = _load_questions()


def get_all_questions(chapter: str | None = None) -> list[dict]:
    if chapter:
        return [q for q in _ALL_QUESTIONS if q["chapter"] == chapter]
    return _ALL_QUESTIONS


def get_chapters_summary() -> list[dict]:
    """Return chapters in canonical order with counts and icons."""
    counts: dict[str, int] = {}
    solvable_counts: dict[str, int] = {}
    for q in _ALL_QUESTIONS:
        ch = q["chapter"]
        counts[ch] = counts.get(ch, 0) + 1
        if q["solvable"]:
            solvable_counts[ch] = solvable_counts.get(ch, 0) + 1

    result = []
    seen = set()
    for ch in CHAPTER_ORDER:
        if ch in counts:
            result.append({
                "name":           ch,
                "icon":           CHAPTER_ICONS.get(ch, "📄"),
                "total":          counts[ch],
                "solvable_count": solvable_counts.get(ch, 0),
            })
            seen.add(ch)
    # Any extra chapters not in canonical order
    for ch, cnt in counts.items():
        if ch not in seen:
            result.append({
                "name":           ch,
                "icon":           CHAPTER_ICONS.get(ch, "📄"),
                "total":          cnt,
                "solvable_count": solvable_counts.get(ch, 0),
            })
    return result
