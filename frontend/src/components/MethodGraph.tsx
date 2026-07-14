'use client';

import React from 'react';

interface Pt { x: number; y: number; }

export interface GraphData {
  type: 'root' | 'ode' | 'integration' | 'interp';
  curve?: Pt[];
  points?: Pt[];
  approxPoints?: Pt[];
  target?: Pt | null;
  root?: number | null;
  method?: string;
  xLabel?: string;
  yLabel?: string;
}

const W = 640;
const H = 400;
const M = { top: 24, right: 24, bottom: 44, left: 56 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

function niceStep(range: number): number {
  if (range <= 0 || !Number.isFinite(range)) return 1;
  const raw = range / 6;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm >= 5 ? 5 : norm >= 2 ? 2 : 1;
  return step * mag;
}

function fmt(v: number): string {
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1000 || a < 0.001) return v.toExponential(1);
  return Number(v.toFixed(3)).toString();
}

export default function MethodGraph({ graph }: { graph: GraphData }) {
  const all: Pt[] = [];
  if (graph.curve) all.push(...graph.curve);
  if (graph.points) all.push(...graph.points);
  if (graph.approxPoints) all.push(...graph.approxPoints);
  if (graph.target) all.push(graph.target);
  if (all.length === 0) return null;

  // Include the y=0 baseline for root & integration so the axis/area reads well.
  const includeZeroY = graph.type === 'root' || graph.type === 'integration';

  let xMin = Math.min(...all.map(p => p.x));
  let xMax = Math.max(...all.map(p => p.x));
  const ys = all.map(p => p.y).filter(Number.isFinite);
  let yMin = Math.min(...ys, includeZeroY ? 0 : Infinity);
  let yMax = Math.max(...ys, includeZeroY ? 0 : -Infinity);

  if (typeof graph.root === 'number') { xMin = Math.min(xMin, graph.root); xMax = Math.max(xMax, graph.root); }

  if (xMin === xMax) { xMin -= 1; xMax += 1; }
  if (yMin === yMax) { yMin -= 1; yMax += 1; }
  const yPad = (yMax - yMin) * 0.08;
  yMin -= yPad; yMax += yPad;

  const sx = (x: number) => M.left + ((x - xMin) / (xMax - xMin)) * PW;
  const sy = (y: number) => M.top + PH - ((y - yMin) / (yMax - yMin)) * PH;

  const clampedCurvePath = (pts: Pt[]) =>
    pts
      .filter(p => Number.isFinite(p.y))
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`)
      .join(' ');

  // gridlines / ticks
  const xStep = niceStep(xMax - xMin);
  const yStep = niceStep(yMax - yMin);
  const xTicks: number[] = [];
  for (let t = Math.ceil(xMin / xStep) * xStep; t <= xMax; t += xStep) xTicks.push(t);
  const yTicks: number[] = [];
  for (let t = Math.ceil(yMin / yStep) * yStep; t <= yMax; t += yStep) yTicks.push(t);

  const axisColor = '#cbd5e1';
  const gridColor = '#eef2f6';
  const accent = '#2563eb';

  const zeroInRange = yMin < 0 && yMax > 0;
  const y0px = sy(0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      style={{ maxWidth: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
      {/* gridlines */}
      {xTicks.map((t, i) => (
        <line key={`gx${i}`} x1={sx(t)} y1={M.top} x2={sx(t)} y2={M.top + PH} stroke={gridColor} strokeWidth={1} />
      ))}
      {yTicks.map((t, i) => (
        <line key={`gy${i}`} x1={M.left} y1={sy(t)} x2={M.left + PW} y2={sy(t)} stroke={gridColor} strokeWidth={1} />
      ))}

      {/* integration: shaded strips (trapezoids under the curve) */}
      {graph.type === 'integration' && graph.points && graph.points.length > 1 &&
        graph.points.slice(0, -1).map((p, i) => {
          const q = graph.points![i + 1];
          const base = sy(0);
          return (
            <polygon key={`strip${i}`}
              points={`${sx(p.x)},${base} ${sx(p.x)},${sy(p.y)} ${sx(q.x)},${sy(q.y)} ${sx(q.x)},${base}`}
              fill="rgba(37,99,235,0.12)" stroke="rgba(37,99,235,0.35)" strokeWidth={1} />
          );
        })}

      {/* axes frame */}
      <rect x={M.left} y={M.top} width={PW} height={PH} fill="none" stroke={axisColor} strokeWidth={1} />

      {/* zero line (x-axis) */}
      {zeroInRange && (
        <line x1={M.left} y1={y0px} x2={M.left + PW} y2={y0px} stroke="#94a3b8" strokeWidth={1.4} strokeDasharray="4 3" />
      )}

      {/* ticks + labels */}
      {xTicks.map((t, i) => (
        <text key={`tx${i}`} x={sx(t)} y={M.top + PH + 16} fontSize={11} fill="#64748b" textAnchor="middle">{fmt(t)}</text>
      ))}
      {yTicks.map((t, i) => (
        <text key={`ty${i}`} x={M.left - 8} y={sy(t) + 3} fontSize={11} fill="#64748b" textAnchor="end">{fmt(t)}</text>
      ))}

      {/* curve (function / solution / polynomial) */}
      {graph.curve && graph.curve.length > 1 && (
        <path d={clampedCurvePath(graph.curve)} fill="none" stroke={accent} strokeWidth={2} />
      )}

      {/* ODE / integration node points */}
      {graph.type === 'ode' && graph.points && (
        <>
          <path d={clampedCurvePath(graph.points)} fill="none" stroke={accent} strokeWidth={2} />
          {graph.points.map((p, i) => (
            <circle key={`op${i}`} cx={sx(p.x)} cy={sy(p.y)} r={3.5} fill={accent} stroke="#fff" strokeWidth={1} />
          ))}
        </>
      )}

      {/* root: vertical line at the root + iteration approximations */}
      {graph.type === 'root' && typeof graph.root === 'number' && (
        <line x1={sx(graph.root)} y1={M.top} x2={sx(graph.root)} y2={M.top + PH}
          stroke="#16a34a" strokeWidth={1.5} strokeDasharray="5 4" />
      )}
      {graph.type === 'root' && graph.approxPoints && graph.approxPoints.map((p, i) => (
        <g key={`ap${i}`}>
          <circle cx={sx(p.x)} cy={sy(p.y)} r={3.5} fill="#f59e0b" stroke="#fff" strokeWidth={1} />
        </g>
      ))}
      {graph.type === 'root' && typeof graph.root === 'number' && Number.isFinite(sy(0)) && (
        <circle cx={sx(graph.root)} cy={sy(0)} r={4.5} fill="#16a34a" stroke="#fff" strokeWidth={1.5} />
      )}

      {/* interpolation: data points + target */}
      {graph.type === 'interp' && graph.points && graph.points.map((p, i) => (
        <circle key={`ip${i}`} cx={sx(p.x)} cy={sy(p.y)} r={4} fill={accent} stroke="#fff" strokeWidth={1} />
      ))}
      {graph.type === 'interp' && graph.target && (
        <g>
          <line x1={sx(graph.target.x)} y1={M.top + PH} x2={sx(graph.target.x)} y2={sy(graph.target.y)}
            stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
          <line x1={M.left} y1={sy(graph.target.y)} x2={sx(graph.target.x)} y2={sy(graph.target.y)}
            stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
          <circle cx={sx(graph.target.x)} cy={sy(graph.target.y)} r={5} fill="#dc2626" stroke="#fff" strokeWidth={1.5} />
        </g>
      )}

      {/* axis labels */}
      <text x={M.left + PW / 2} y={H - 6} fontSize={12} fill="#475569" textAnchor="middle">{graph.xLabel ?? 'x'}</text>
      <text x={14} y={M.top + PH / 2} fontSize={12} fill="#475569" textAnchor="middle"
        transform={`rotate(-90 14 ${M.top + PH / 2})`}>{graph.yLabel ?? 'y'}</text>
    </svg>
  );
}
