"""
solver_params_extractor.py  –  Heuristic extraction of numerical solver inputs
from natural-language past exam questions.

Each extractor returns a dict that matches the solver's expected URL params so
the frontend can pre-fill the solver form.  Unrecognised questions return an
empty dict and the frontend falls back to sensible defaults.
"""

import re
from typing import Any

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _find_numbers(text: str) -> list[float]:
    """Return all numbers (incl. negative) found in text."""
    return [float(m) for m in re.findall(r"-?\d+(?:\.\d+)?(?:e[+-]?\d+)?", text)]


def _strip_latex(text: str) -> str:
    """Remove common LaTeX markup so regex can find the math."""
    text = re.sub(r"\\frac\{([^}]+)\}\{([^}]+)\}", r"(\1)/(\2)", text)
    text = re.sub(r"\\[a-zA-Z]+\*?", " ", text)
    text = re.sub(r"[{}]", " ", text)
    return text


def _latex_func_to_python(expr: str) -> str:
    """Best-effort conversion of a LaTeX-flavoured expression to Python syntax."""
    expr = re.sub(r"\\frac\{([^}]+)\}\{([^}]+)\}", r"(\1)/(\2)", expr)
    expr = re.sub(r"\\sqrt\{([^}]+)\}", r"(\1)**0.5", expr)
    expr = re.sub(r"\\left|\\right|\\,|\\;|\\!", "", expr)
    expr = re.sub(r"\^([0-9]+)", r"**\1", expr)        # x^3 → x**3
    expr = re.sub(r"\^(\{[^}]+\})", lambda m: f"**({m.group(1)[1:-1]})", expr)
    expr = re.sub(r"\\ln", "log", expr)
    expr = re.sub(r"\\log", "log10", expr)
    expr = re.sub(r"\\sin", "sin", expr)
    expr = re.sub(r"\\cos", "cos", expr)
    expr = re.sub(r"\\tan", "tan", expr)
    expr = re.sub(r"\\exp", "exp", expr)
    expr = re.sub(r"\\e\b", "exp(1)", expr)
    expr = re.sub(r"[{}]", "", expr)
    expr = re.sub(r"\s+", "", expr)
    return expr.strip()


def _extract_func_from_equation(question: str) -> str | None:
    """
    Try to extract f(x) = 0 style equations.
    e.g. "root of x^3 - x - 1 = 0" → "x**3 - x - 1"
    """
    patterns = [
        r"\$f\(x\)\s*=\s*([^$]+?)\$",                    # $f(x) = expr$
        r"f\(x\)\s*=\s*([^$,.\n]+)",                     # f(x) = expr
        r"equation\s+([^$]+?)\s*=\s*0",                  # equation ... = 0
        r"\$([^$]+?)\s*=\s*0\$",                         # $expr = 0$
        r"root of (?:the equation\s*)?(?:\$)?(.+?)\s*=\s*0",
        r"solve\s+(?:\$)?(.+?)\s*=\s*0",
    ]
    for pat in patterns:
        m = re.search(pat, question, re.IGNORECASE)
        if m:
            raw = m.group(1).strip().strip("$")
            if raw == "0" or raw.lower() == "y" or raw.lower() == "f(x)":
                continue
            py = _latex_func_to_python(raw)
            # Make sure we didn't just capture English text like "0 is"
            if py and len(py) >= 1 and not re.search(r'\bis\b|\bthe\b|\bof\b', py.lower()):
                return py
    return None


def _extract_ode_func(question: str) -> str | None:
    """
    Extract RHS of dy/dx = f(x,y) or y' = f.
    """
    patterns = [
        r"\\frac\{dy\}\{dx\}\s*=\s*(.+?)(?:\s*,|\s*\$|\s*with|\s*and|\s*$)",
        r"y'\s*=\s*(.+?)(?:\s*,|\s*\$|\s*with|\s*\.|\s*$)",
        r"y'\s*=\s*\$(.+?)\$",
    ]
    for pat in patterns:
        m = re.search(pat, question, re.IGNORECASE)
        if m:
            raw = m.group(1).strip().strip("$").strip(",").strip()
            py = _latex_func_to_python(raw)
            if py:
                return py
    return None


def _extract_integral_func(question: str) -> str | None:
    """
    Extract integrand from ∫_a^b f(x) dx style expressions.
    """
    # LaTeX: \int_0^1 f(x) \, dx
    m = re.search(r"\\int[_^{}\d\w]+\s+(.+?)\s*(?:\\,\s*)?d[xyzt]", question)
    if m:
        raw = m.group(1).strip().strip("$")
        return _latex_func_to_python(raw)

    # Plain text: integral of f(x) from
    m = re.search(r"integral of (.+?) (?:from|over|between)", question, re.IGNORECASE)
    if m:
        return _latex_func_to_python(m.group(1))

    return None


def _extract_bounds(question: str) -> tuple[float | None, float | None]:
    """Extract interval [a, b] from text."""
    stripped = _strip_latex(question)

    # "in [a, b]" or "in (a, b)" or "interval (a, b)"
    m = re.search(r"(?:in|interval|between)\s*[\[(](-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)[\])]", stripped, re.IGNORECASE)
    if m:
        return float(m.group(1)), float(m.group(2))

    # "initial approximations a and b"
    m = re.search(r"approximations?\s+(-?\d+\.?\d*)\s+and\s+(-?\d+\.?\d*)", stripped, re.IGNORECASE)
    if m:
        return float(m.group(1)), float(m.group(2))

    # \int_a^b – bounds from LaTeX integral
    m = re.search(r"\\int_\{?(-?\d+\.?\d*)\}?\^\{?(-?\d+\.?\d*)\}?", question)
    if m:
        return float(m.group(1)), float(m.group(2))

    # from 0 to 1 style
    m = re.search(r"from\s+(-?\d+\.?\d*)\s+to\s+(-?\d+\.?\d*)", stripped, re.IGNORECASE)
    if m:
        return float(m.group(1)), float(m.group(2))

    return None, None


def _extract_x0_y0(question: str) -> tuple[float | None, float | None]:
    """Extract initial condition x0, y0."""
    stripped = _strip_latex(question)

    # y(x0) = y0 pattern
    m = re.search(r"y\s*\((-?\d+\.?\d*)\)\s*=\s*(-?\d+\.?\d*)", stripped)
    if m:
        return float(m.group(1)), float(m.group(2))

    # "given that x0 = N" or "x_0 = N"
    m = re.search(r"x[_0]*\s*=\s*(-?\d+\.?\d*)", stripped, re.IGNORECASE)
    x0 = float(m.group(1)) if m else None

    m2 = re.search(r"y[_0]*\s*=\s*(-?\d+\.?\d*)", stripped, re.IGNORECASE)
    y0 = float(m2.group(1)) if m2 else None

    return x0, y0


def _extract_step_size(question: str) -> float | None:
    stripped = _strip_latex(question)
    m = re.search(r"(?:step\s*size|h)\s*=\s*(-?\d+\.?\d*(?:/\d+)?)", stripped, re.IGNORECASE)
    if m:
        val = m.group(1)
        if '/' in val:
            parts = val.split('/')
            return float(parts[0]) / float(parts[1])
        return float(val)
    return None


def _extract_n(question: str) -> int | None:
    stripped = _strip_latex(question)
    m = re.search(r"n\s*=\s*(\d+)", stripped, re.IGNORECASE)
    if m:
        return int(m.group(1))
    # step size → derive n from bounds if possible
    return None


# ---------------------------------------------------------------------------
# Per-method extractors
# ---------------------------------------------------------------------------

def _params_bisection(question: str) -> dict[str, Any]:
    func = _extract_func_from_equation(question)
    a, b = _extract_bounds(question)
    return {
        "method": "bisection",
        "func_str": func or "x**3 - x - 1",
        "a": a if a is not None else 1.0,
        "b": b if b is not None else 2.0,
        "tol": 1e-4,
        "max_iter": 50,
    }


def _params_newton_raphson(question: str) -> dict[str, Any]:
    func = _extract_func_from_equation(question)
    x0, _ = _extract_x0_y0(question)
    # Try "x0 = N" style
    if x0 is None:
        stripped = _strip_latex(question)
        m = re.search(r"x_?0\s*=\s*(-?\d+\.?\d*)", stripped, re.IGNORECASE)
        if m:
            x0 = float(m.group(1))
    return {
        "method": "newton-raphson",
        "func_str": func or "x**3 - x - 1",
        "deriv_str": "",    # user must fill derivative
        "x0": x0 if x0 is not None else 1.5,
        "tol": 1e-6,
        "max_iter": 50,
    }


def _params_secant(question: str) -> dict[str, Any]:
    func = _extract_func_from_equation(question)
    # secant needs x0, x1 – try to grab two initial guesses
    stripped = _strip_latex(question)
    nums = _find_numbers(stripped)
    x0, x1 = (nums[0], nums[1]) if len(nums) >= 2 else (1.0, 2.0)
    return {
        "method": "secant",
        "func_str": func or "x**3 - x - 1",
        "x0": x0,
        "x1": x1,
        "tol": 1e-6,
        "max_iter": 50,
    }


def _params_false_position(question: str) -> dict[str, Any]:
    func = _extract_func_from_equation(question)
    a, b = _extract_bounds(question)
    return {
        "method": "false-position",
        "func_str": func or "x**3 - x - 1",
        "a": a if a is not None else 1.0,
        "b": b if b is not None else 2.0,
        "tol": 1e-4,
        "max_iter": 50,
    }


def _params_euler(question: str) -> dict[str, Any]:
    func = _extract_ode_func(question)
    x0, y0 = _extract_x0_y0(question)
    h = _extract_step_size(question)
    return {
        "method": "euler",
        "func_str": func or "x + y",
        "x0": x0 if x0 is not None else 0.0,
        "y0": y0 if y0 is not None else 1.0,
        "h": h if h is not None else 0.1,
        "steps_count": 5,
    }


def _params_modified_euler(question: str) -> dict[str, Any]:
    p = _params_euler(question)
    p["method"] = "modified-euler"
    return p


def _params_rk4(question: str) -> dict[str, Any]:
    func = _extract_ode_func(question)
    x0, y0 = _extract_x0_y0(question)
    h = _extract_step_size(question)
    return {
        "method": "rk4",
        "func_str": func or "x + y",
        "x0": x0 if x0 is not None else 0.0,
        "y0": y0 if y0 is not None else 1.0,
        "h": h if h is not None else 0.1,
        "steps_count": 5,
    }


def _params_trapezoidal(question: str) -> dict[str, Any]:
    func = _extract_integral_func(question)
    a, b = _extract_bounds(question)
    h = _extract_step_size(question)
    n = _extract_n(question)
    # If only h is known, derive n from bounds
    if n is None and h and a is not None and b is not None:
        n = max(1, round((b - a) / h))
    return {
        "method": "trapezoidal",
        "func_str": func or "1/(1+x)",
        "a": a if a is not None else 0.0,
        "b": b if b is not None else 1.0,
        "n": n if n is not None else 4,
    }


def _params_simpson_13(question: str) -> dict[str, Any]:
    p = _params_trapezoidal(question)
    p["method"] = "simpson-13"
    return p


def _params_simpson_38(question: str) -> dict[str, Any]:
    p = _params_trapezoidal(question)
    p["method"] = "simpson-38"
    if p["n"] and p["n"] % 3 != 0:
        p["n"] = max(3, (p["n"] // 3) * 3)
    return p


def _params_forward_difference(question: str) -> dict[str, Any]:
    """Interpolation — no automated solver yet, return empty."""
    return {"method": "forward-difference"}


# ---------------------------------------------------------------------------
# Dispatch table
# ---------------------------------------------------------------------------

_EXTRACTORS = {
    "bisection":          _params_bisection,
    "false-position":     _params_false_position,
    "newton-raphson":     _params_newton_raphson,
    "secant":             _params_secant,
    "euler":              _params_euler,
    "modified-euler":     _params_modified_euler,
    "rk4":                _params_rk4,
    "trapezoidal":        _params_trapezoidal,
    "simpson-13":         _params_simpson_13,
    "simpson-38":         _params_simpson_38,
    "forward-difference": _params_forward_difference,
    "lu-decomposition":   lambda _: {"method": "lu-decomposition"},
    "gauss-seidel":       lambda _: {"method": "gauss-seidel"},
    "gauss-jacobi":       lambda _: {"method": "gauss-jacobi"},
    "thomas-algorithm":   lambda _: {"method": "thomas-algorithm"},
}


def extract_solver_params(question_text: str, solver_method: str) -> dict[str, Any]:
    """
    Main entry point.  Returns a dict of pre-filled solver params for the given
    solver_method, extracted heuristically from question_text.
    """
    extractor = _EXTRACTORS.get(solver_method)
    if extractor is None:
        return {}
    try:
        return extractor(question_text)
    except Exception:
        # Never crash the API; just return empty and let the solver use defaults
        return {"method": solver_method}
