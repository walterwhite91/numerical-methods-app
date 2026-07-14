import { Hono } from "hono";
import { cors } from "hono/cors";

import { bisectionMethod } from "./methods/bisection";
import { secantMethod } from "./methods/secant";
import { falsePositionMethod } from "./methods/falsePosition";
import { newtonRaphsonMethod } from "./methods/newtonRaphson";
import { generalizedNewtonMethod } from "./methods/generalizedNewton";
import { eulerMethod } from "./methods/euler";
import { modifiedEulerMethod } from "./methods/modifiedEuler";
import { rungeKutta4 } from "./methods/rk4";
import { numericalIntegrationTrapezoidal } from "./methods/trapezoidal";
import { numericalIntegrationSimpson13 } from "./methods/simpson13";
import { numericalIntegrationSimpson38 } from "./methods/simpson38";
import { forwardDifferenceMethod, backwardDifferenceMethod } from "./methods/interpolation";
import { buildRootGraph, buildOdeGraph, buildIntegrationGraph } from "./lib/graph";
import { getAllQuestions, getChaptersSummary } from "./pastQna";
import { extractSolverParams } from "./solverParamsExtractor";

const app = new Hono();

app.use("*", cors());

interface RootRequest {
  func_str: string;
  deriv_str?: string;
  a?: number;
  b?: number;
  x0?: number;
  x1?: number;
  tol?: number;
  max_iter?: number;
  multiplicity?: number;
}

interface OdeRequest {
  func_str: string;
  x0: number;
  y0: number;
  h: number;
  steps_count: number;
}

interface IntegrationRequest {
  func_str: string;
  a: number;
  b: number;
  n: number;
  method: string;
}

function withGraph<T extends { success?: boolean }>(result: T, graph: unknown): T {
  if (result.success && graph) (result as Record<string, unknown>).graph = graph;
  return result;
}

app.post("/api/root-finding/bisection", async (c) => {
  const req = await c.req.json<RootRequest>();
  const result = bisectionMethod(req.func_str, req.a!, req.b!, req.tol ?? 1e-6, req.max_iter ?? 100);
  return c.json(withGraph(result, buildRootGraph(req.func_str, result, "midpoint")));
});

app.post("/api/root-finding/secant", async (c) => {
  const req = await c.req.json<RootRequest>();
  const result = secantMethod(req.func_str, req.x0!, req.x1!, req.tol ?? 1e-6, req.max_iter ?? 100);
  return c.json(withGraph(result, buildRootGraph(req.func_str, result, "x_new")));
});

app.post("/api/root-finding/false-position", async (c) => {
  const req = await c.req.json<RootRequest>();
  const result = falsePositionMethod(req.func_str, req.a!, req.b!, req.tol ?? 1e-6, req.max_iter ?? 100);
  return c.json(withGraph(result, buildRootGraph(req.func_str, result, "c")));
});

app.post("/api/root-finding/newton-raphson", async (c) => {
  const req = await c.req.json<RootRequest>();
  const result = newtonRaphsonMethod(req.func_str, req.deriv_str ?? "", req.x0!, req.tol ?? 1e-6, req.max_iter ?? 100);
  return c.json(withGraph(result, buildRootGraph(req.func_str, result, "x_new")));
});

app.post("/api/root-finding/generalized-newton", async (c) => {
  const req = await c.req.json<RootRequest>();
  const result = generalizedNewtonMethod(
    req.func_str,
    req.deriv_str ?? "",
    req.x0!,
    req.multiplicity ?? 1,
    req.tol ?? 1e-6,
    req.max_iter ?? 100
  );
  return c.json(withGraph(result, buildRootGraph(req.func_str, result, "x_new")));
});

app.post("/api/ode/euler", async (c) => {
  const req = await c.req.json<OdeRequest>();
  const result = eulerMethod(req.func_str, req.x0, req.y0, req.h, req.steps_count);
  return c.json(withGraph(result, buildOdeGraph(result)));
});

app.post("/api/ode/modified-euler", async (c) => {
  const req = await c.req.json<OdeRequest>();
  const result = modifiedEulerMethod(req.func_str, req.x0, req.y0, req.h, req.steps_count);
  return c.json(withGraph(result, buildOdeGraph(result)));
});

app.post("/api/ode/rk4", async (c) => {
  const req = await c.req.json<OdeRequest>();
  const result = rungeKutta4(req.func_str, req.x0, req.y0, req.h, req.steps_count);
  return c.json(withGraph(result, buildOdeGraph(result)));
});

app.post("/api/integration", async (c) => {
  const req = await c.req.json<IntegrationRequest>();
  let result;
  if (req.method === "trapezoidal") {
    result = numericalIntegrationTrapezoidal(req.func_str, req.a, req.b, req.n);
  } else if (req.method === "simpson_13") {
    result = numericalIntegrationSimpson13(req.func_str, req.a, req.b, req.n);
  } else if (req.method === "simpson_38") {
    result = numericalIntegrationSimpson38(req.func_str, req.a, req.b, req.n);
  } else {
    return c.json({ success: false, message: "Unknown integration method" });
  }
  return c.json(withGraph(result, buildIntegrationGraph(req.func_str, result)));
});

interface InterpolationRequest {
  x: number[];
  y: number[];
  xq: number;
}

app.post("/api/interpolation/forward-difference", async (c) => {
  const req = await c.req.json<InterpolationRequest>();
  return c.json(forwardDifferenceMethod(req.x, req.y, req.xq));
});

app.post("/api/interpolation/backward-difference", async (c) => {
  const req = await c.req.json<InterpolationRequest>();
  return c.json(backwardDifferenceMethod(req.x, req.y, req.xq));
});

// ─── Past Q&As ────────────────────────────────────────────────────────────────

app.get("/api/past-qna/chapters", (c) => {
  return c.json({ success: true, chapters: getChaptersSummary() });
});

app.get("/api/past-qna", (c) => {
  const chapter = c.req.query("chapter") ?? null;
  const questions = getAllQuestions(chapter);
  return c.json({
    success: true,
    total: questions.length,
    chapter_filter: chapter,
    questions,
  });
});

app.get("/api/past-qna/:question_id/solver-params", (c) => {
  const questionId = parseInt(c.req.param("question_id"), 10);
  const allQs = getAllQuestions();
  const match = allQs.find((q) => q.id === questionId);

  if (!match) {
    return c.json({ success: false, message: `Question ${questionId} not found.` });
  }

  if (!match.solvable || !match.solver_method) {
    return c.json({ success: false, message: "This question is not linked to a solver method." });
  }

  const params = extractSolverParams(match.question, match.solver_method);
  return c.json({
    success: true,
    question_id: questionId,
    solver_method: match.solver_method,
    solver_category: match.solver_category,
    params,
  });
});

export default app;
