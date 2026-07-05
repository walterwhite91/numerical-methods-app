// Port of backend/methods/past_qna.py
import pastQnaData from "./data/pastQnaData.json";

interface RawQuestion {
  subject?: string;
  question?: string;
  marks?: number;
  options?: string[];
  exam_mode_answer?: string;
  guided_mode_answer?: string | null;
  chapter?: string;
  sub_chapter?: string;
}

export interface Question {
  id: number;
  subject: string;
  question: string;
  marks: number;
  options: string[];
  exam_mode_answer: string;
  guided_mode_answer: string | null;
  chapter: string;
  sub_chapter: string;
  solvable: boolean;
  solver_method: string | null;
  solver_category: string | null;
}

interface SolverMeta {
  solvable: boolean;
  solver_method: string | null;
  solver_category: string | null;
}

const SUB_CHAPTER_SOLVER_MAP: Record<string, SolverMeta> = {
  // Root Finding
  "Bisection (half-interval) method": { solvable: true, solver_method: "bisection", solver_category: "root-finding" },
  "Newton-Raphson method": { solvable: true, solver_method: "newton-raphson", solver_category: "root-finding" },
  "Secant method": { solvable: true, solver_method: "secant", solver_category: "root-finding" },
  "False position": { solvable: true, solver_method: "false-position", solver_category: "root-finding" },
  "Fixed point iteration": { solvable: true, solver_method: "false-position", solver_category: "root-finding" },
  "Errors in numerical calculations": { solvable: false, solver_method: null, solver_category: "error-detection" },
  // Linear Systems
  "LU decomposition": { solvable: true, solver_method: "lu-decomposition", solver_category: "linear-systems" },
  "Gauss-Seidel iterative method": { solvable: true, solver_method: "gauss-seidel", solver_category: "linear-systems" },
  "Jacobi iterative method": { solvable: true, solver_method: "gauss-jacobi", solver_category: "linear-systems" },
  "Thomas algorithm": { solvable: true, solver_method: "thomas-algorithm", solver_category: "linear-systems" },
  // ODEs
  "Euler's method": { solvable: true, solver_method: "euler", solver_category: "ode" },
  "Runge-Kutta fourth-order method": { solvable: true, solver_method: "rk4", solver_category: "ode" },
  "Initial value problems": { solvable: true, solver_method: "euler", solver_category: "ode" },
  "Finite difference method": { solvable: false, solver_method: null, solver_category: null },
  "Boundary value problems": { solvable: false, solver_method: null, solver_category: null },
  // Integration
  "Simpson's 1/3 rule": { solvable: true, solver_method: "simpson-13", solver_category: "integration" },
  "Trapezoidal rule (simple and composite)": { solvable: true, solver_method: "trapezoidal", solver_category: "integration" },
  "Numerical differentiation techniques": { solvable: false, solver_method: null, solver_category: null },
  // Interpolation
  "Newton's forward and backward difference interpolation": {
    solvable: true,
    solver_method: "forward-difference",
    solver_category: "finite-differences",
  },
  "Newton's divided difference interpolation": { solvable: false, solver_method: null, solver_category: null },
  "Lagrange's interpolation": { solvable: false, solver_method: null, solver_category: null },
  "Linear regression": { solvable: false, solver_method: null, solver_category: null },
  "Least squares method": { solvable: false, solver_method: null, solver_category: null },
};

const CHAPTER_ORDER = [
  "Solution of Nonlinear Equations",
  "System of Linear Algebraic Equations",
  "Interpolation and Regression",
  "Numerical Differentiation and Integration",
  "Solution of Ordinary Differential Equations",
  "Solution of Partial Differential Equations",
];

const CHAPTER_ICONS: Record<string, string> = {
  "Solution of Nonlinear Equations": "🎯",
  "System of Linear Algebraic Equations": "🔢",
  "Interpolation and Regression": "📈",
  "Numerical Differentiation and Integration": "∫",
  "Solution of Ordinary Differential Equations": "📐",
  "Solution of Partial Differential Equations": "🌊",
};

function resolveSolver(subChapter: string): SolverMeta {
  for (const [key, meta] of Object.entries(SUB_CHAPTER_SOLVER_MAP)) {
    if (key.includes(subChapter) || subChapter.includes(key)) return meta;
  }
  return { solvable: false, solver_method: null, solver_category: null };
}

function loadQuestions(): Question[] {
  return (pastQnaData as RawQuestion[]).map((q, idx) => {
    const sub = q.sub_chapter ?? "";
    const solverMeta = resolveSolver(sub);
    return {
      id: idx,
      subject: q.subject ?? "",
      question: q.question ?? "",
      marks: q.marks ?? 0,
      options: q.options ?? [],
      exam_mode_answer: q.exam_mode_answer ?? "",
      guided_mode_answer: q.guided_mode_answer ?? null,
      chapter: q.chapter ?? "",
      sub_chapter: sub,
      solvable: solverMeta.solvable,
      solver_method: solverMeta.solver_method,
      solver_category: solverMeta.solver_category,
    };
  });
}

const ALL_QUESTIONS: Question[] = loadQuestions();

export function getAllQuestions(chapter?: string | null): Question[] {
  if (chapter) return ALL_QUESTIONS.filter((q) => q.chapter === chapter);
  return ALL_QUESTIONS;
}

export function getChaptersSummary() {
  const counts: Record<string, number> = {};
  const solvableCounts: Record<string, number> = {};

  for (const q of ALL_QUESTIONS) {
    counts[q.chapter] = (counts[q.chapter] ?? 0) + 1;
    if (q.solvable) solvableCounts[q.chapter] = (solvableCounts[q.chapter] ?? 0) + 1;
  }

  const result: { name: string; icon: string; total: number; solvable_count: number }[] = [];
  const seen = new Set<string>();

  for (const ch of CHAPTER_ORDER) {
    if (ch in counts) {
      result.push({
        name: ch,
        icon: CHAPTER_ICONS[ch] ?? "📄",
        total: counts[ch],
        solvable_count: solvableCounts[ch] ?? 0,
      });
      seen.add(ch);
    }
  }

  for (const [ch, cnt] of Object.entries(counts)) {
    if (!seen.has(ch)) {
      result.push({
        name: ch,
        icon: CHAPTER_ICONS[ch] ?? "📄",
        total: cnt,
        solvable_count: solvableCounts[ch] ?? 0,
      });
    }
  }

  return result;
}
