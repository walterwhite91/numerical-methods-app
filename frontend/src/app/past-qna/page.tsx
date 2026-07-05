'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import TextWithMath from '@/components/TextWithMath';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PastQuestion {
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

interface ChapterMeta {
  name: string;
  icon: string;
  total: number;
  solvable_count: number;
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Zap: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  FileText: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Eye: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Lightbulb: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 7v1"/><path d="M4.22 5.22l.71.71"/><path d="M19.78 5.22l-.71.71"/><path d="M2 12h1"/><path d="M21 12h1"/><path d="M4.22 18.78l.71-.71"/><path d="M19.78 18.78l-.71-.71"/><circle cx="12" cy="12" r="5"/></svg>,
  CheckCircle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  AlertTriangle: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  ChapterIcon: ({ iconStr }: { iconStr: string }) => {
    switch (iconStr) {
      case '🎯': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
      case '🔢': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>;
      case '📈': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
      case '∫': return <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>∫</span>;
      case '📐': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 15.3l-3.6-3.6a2 2 0 0 0-2.8 0l-3.6 3.6a2 2 0 0 0 0 2.8l3.6 3.6a2 2 0 0 0 2.8 0l3.6-3.6a2 2 0 0 0 0-2.8z"/><path d="M14.5 9.5L8.2 3.2a2 2 0 0 0-2.8 0l-2.2 2.2a2 2 0 0 0 0 2.8l6.3 6.3"/></svg>;
      case '🌊': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h2a2 2 0 0 0 2-2 2 2 0 0 1 4 0 2 2 0 0 0 4 0 2 2 0 0 1 4 0 2 2 0 0 0 2 2h2"/></svg>;
      default: return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    }
  }
};

// ─── Math Renderer ─────────────────────────────────────────────────────────────
// Enhancing TextWithMath usage to handle newlines properly and support Block Math ($$..$$)
function renderMath(text: string | null): React.ReactNode {
  if (!text) return null;
  
  // Split by double dollar and single dollar
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      try { return <BlockMath key={i} math={part.slice(2, -2)} />; }
      catch { return <span key={i}>{part}</span>; }
    }
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      try { return <InlineMath key={i} math={part.slice(1, -1)} />; }
      catch { return <span key={i}>{part}</span>; }
    }
    // Handle standard text new lines
    return part.split('\n').map((line, j, arr) => (
      <React.Fragment key={`${i}-${j}`}>
        {line}{j < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  });
}

// ─── Badge Components ──────────────────────────────────────────────────────────
function MarksBadge({ marks }: { marks: number }) {
  const isLong = marks > 1;
  return (
    <span style={{
      padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem',
      fontWeight: 700,
      backgroundColor: isLong ? '#dbeafe' : '#f0fdf4',
      color: isLong ? '#1d4ed8' : '#16a34a',
      border: `1px solid ${isLong ? '#bfdbfe' : '#bbf7d0'}`,
    }}>
      {marks} {marks === 1 ? 'mark' : 'marks'}
    </span>
  );
}

function SubChapterBadge({ text }: { text: string }) {
  return (
    <span style={{
      padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.72rem',
      fontWeight: 500, backgroundColor: '#f1f5f9', color: '#64748b',
      border: '1px solid #e2e8f0',
      maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      display: 'inline-block',
    }}>
      {text}
    </span>
  );
}

// ─── Question Card ─────────────────────────────────────────────────────────────
function QuestionCard({ q, index }: { q: PastQuestion; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showGuided, setShowGuided] = useState(false);

  // Deep link to solver passing qid so that solver fetches inputs
  const solverUrl = q.solvable && q.solver_method
    ? `/solver?method=${q.solver_method}&category=${q.solver_category}&qid=${q.id}`
    : null;

  return (
    <div
      style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1rem',
        padding: '1.4rem', marginBottom: '0.9rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)')}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{
            width: '1.75rem', height: '1.75rem', borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #0f172a)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
          }}>{index + 1}</span>
          <MarksBadge marks={q.marks} />
          {q.sub_chapter && <SubChapterBadge text={q.sub_chapter} />}
        </div>
        {solverUrl && (
          <a
            href={solverUrl}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.85rem', borderRadius: '0.5rem', fontSize: '0.78rem',
              fontWeight: 600, flexShrink: 0,
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white', textDecoration: 'none', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Icons.Zap /> Solve
          </a>
        )}
      </div>

      {/* Question text */}
      <div style={{ fontSize: '0.95rem', lineHeight: '1.75', color: '#1e293b', marginBottom: '1rem' }}>
        {renderMath(q.question)}
      </div>

      {/* MCQ options */}
      {q.options && q.options.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.45rem', marginBottom: '0.9rem' }}>
          {q.options.map((opt, i) => (
            <div key={i} style={{
              padding: '0.45rem 0.8rem', border: '1px solid #e2e8f0',
              borderRadius: '0.5rem', fontSize: '0.87rem', color: '#475569', background: '#f8fafc',
            }}>
              <span style={{ fontWeight: 700, color: '#94a3b8', marginRight: '0.35rem' }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {renderMath(opt)}
            </div>
          ))}
        </div>
      )}

      {/* Question type notice */}
      {(!q.options || q.options.length === 0) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 0.9rem', background: '#fafafa',
          border: '1px solid #f1f5f9', borderRadius: '0.5rem',
          marginBottom: '0.85rem', fontSize: '0.82rem', color: '#64748b',
        }}>
          <Icons.FileText />
          <span>
            <strong>{q.marks > 2 ? 'Long-form' : 'Short-form'}</strong> — carries {q.marks} {q.marks === 1 ? 'mark' : 'marks'}, requires {q.marks > 2 ? 'a detailed written solution' : 'a brief calculation or response'}.
          </span>
        </div>
      )}

      {/* Toggle buttons */}
      <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
        <button onClick={() => setShowAnswer(!showAnswer)} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.38rem 0.9rem', borderRadius: '0.4rem', fontSize: '0.8rem', fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.18s',
          background: showAnswer ? '#0f172a' : 'transparent',
          color: showAnswer ? 'white' : '#0f172a',
          border: '1px solid #0f172a',
        }}>
          {showAnswer ? <Icons.Check /> : <Icons.Eye />}
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
        {q.guided_mode_answer && (
          <button onClick={() => setShowGuided(!showGuided)} style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.38rem 0.9rem', borderRadius: '0.4rem', fontSize: '0.8rem', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.18s',
            background: showGuided ? '#7c3aed' : 'transparent',
            color: showGuided ? 'white' : '#7c3aed',
            border: '1px solid #7c3aed',
          }}>
            {showGuided ? <Icons.Check /> : <Icons.Lightbulb />}
            {showGuided ? 'Hide Explanation' : 'Guided Explanation'}
          </button>
        )}
      </div>

      {/* Answer panel */}
      {showAnswer && (
        <div style={{
          marginTop: '0.9rem', padding: '1rem 1.2rem',
          background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
          border: '1px solid #bbf7d0', borderRadius: '0.75rem', fontSize: '0.9rem', lineHeight: '1.75',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#16a34a', marginBottom: '0.4rem', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
            <Icons.CheckCircle /> ANSWER
          </div>
          <div style={{ color: '#1e293b' }}>{renderMath(q.exam_mode_answer)}</div>
        </div>
      )}

      {/* Guided explanation panel */}
      {showGuided && q.guided_mode_answer && (
        <div style={{
          marginTop: '0.65rem', padding: '1rem 1.2rem',
          background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
          border: '1px solid #d8b4fe', borderRadius: '0.75rem', fontSize: '0.87rem', lineHeight: '1.8',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#7c3aed', marginBottom: '0.6rem', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
            <Icons.Lightbulb /> GUIDED EXPLANATION
          </div>
          <div style={{ color: '#1e293b', whiteSpace: 'pre-wrap' }}>{renderMath(q.guided_mode_answer)}</div>
        </div>
      )}
    </div>
  );
}

// ─── Chapter Panel ─────────────────────────────────────────────────────────────
function ChapterPanel({ questions }: { questions: PastQuestion[] }) {
  const [filter, setFilter] = useState<'all' | 'mcq' | 'short' | 'long'>('all');

  const filtered = useMemo(() => {
    if (filter === 'mcq') return questions.filter(q => q.options && q.options.length > 0);
    if (filter === 'short') return questions.filter(q => (!q.options || q.options.length === 0) && q.marks <= 2);
    if (filter === 'long') return questions.filter(q => q.marks > 2);
    return questions;
  }, [questions, filter]);

  const mcqCount = questions.filter(q => q.options && q.options.length > 0).length;
  const shortCount = questions.filter(q => (!q.options || q.options.length === 0) && q.marks <= 2).length;
  const longCount = questions.filter(q => q.marks > 2).length;
  const solvable = questions.filter(q => q.solvable).length;

  return (
    <div>
      {/* Stats + filter row */}
      <div style={{
        display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem',
        padding: '1rem 1.25rem', background: 'white',
        border: '1px solid #e2e8f0', borderRadius: '0.75rem',
      }}>
        {[
          { label: 'Total', value: questions.length, color: '#0f172a' },
          { label: 'MCQ', value: mcqCount, color: '#2563eb' },
          { label: 'Short-form', value: shortCount, color: '#7c3aed' },
          { label: 'Long-form', value: longCount, color: '#16a34a' },
          { label: 'Solvable', value: solvable, color: '#d97706' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', minWidth: '58px' }}>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          {(['all', 'mcq', 'short', 'long'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.28rem 0.7rem', borderRadius: '0.4rem', fontSize: '0.76rem',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              background: filter === f ? '#0f172a' : 'transparent',
              color: filter === f ? 'white' : '#64748b',
              border: `1px solid ${filter === f ? '#0f172a' : '#e2e8f0'}`,
            }}>
              {f === 'all' ? 'All' : f === 'mcq' ? 'MCQs' : f === 'short' ? 'Short-form' : 'Long-form'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0
        ? <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No questions match this filter.</div>
        : filtered.map((q, i) => <QuestionCard key={q.id} q={q} index={i} />)
      }
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PastQnAPage() {
  const [chapters, setChapters] = useState<ChapterMeta[]>([]);
  const [activeChapter, setActiveChapter] = useState<string>('');
  const [questions, setQuestions] = useState<PastQuestion[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Fetch chapter list on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/past-qna/chapters`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setChapters(data.chapters);
          if (data.chapters.length > 0) setActiveChapter(data.chapters[0].name);
        } else {
          setError('Failed to load chapters.');
        }
      })
      .catch(() => setError('Cannot reach the backend API. Is it running on http://127.0.0.1:8000?'))
      .finally(() => setLoadingChapters(false));
  }, []);

  // Fetch questions when active chapter changes
  const fetchQuestions = useCallback((chapter: string) => {
    setLoadingQuestions(true);
    setSearch('');
    fetch(`${API_BASE}/api/past-qna?chapter=${encodeURIComponent(chapter)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setQuestions(data.questions);
        else setError('Failed to load questions for this chapter.');
      })
      .catch(() => setError('API error while loading questions.'))
      .finally(() => setLoadingQuestions(false));
  }, []);

  useEffect(() => {
    if (activeChapter) fetchQuestions(activeChapter);
  }, [activeChapter, fetchQuestions]);

  const displayed = useMemo(() => {
    if (!search.trim()) return questions;
    const q = search.toLowerCase();
    return questions.filter(x =>
      x.question.toLowerCase().includes(q) ||
      x.sub_chapter?.toLowerCase().includes(q)
    );
  }, [questions, search]);

  const totalQuestions = chapters.reduce((s, c) => s + c.total, 0);

  // ── Render ──
  if (loadingChapters) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <p style={{ color: '#64748b' }}>Loading past questions…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '1rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#dc2626' }}>
        <Icons.AlertTriangle />
      </div>
      <h2 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Connection Error</h2>
      <p style={{ color: '#64748b', marginBottom: '1rem' }}>{error}</p>
      <button onClick={() => { setError(null); setLoadingChapters(true); window.location.reload(); }}
        style={{ padding: '0.6rem 1.4rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
        Retry
      </button>
    </div>
  );

  const activeMeta = chapters.find(c => c.name === activeChapter);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0.5rem' }}>
      {/* Header */}
      <header style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', color: '#0f172a' }}>
          <Icons.Book />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>Past Q&amp;As</h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.97rem', margin: 0 }}>
          {totalQuestions} questions from MCSC-202 past papers, organised by chapter.
          Expand answers, read guided explanations, or jump to the solver.
        </p>
      </header>

      {/* Search */}
      <div style={{ marginBottom: '1.4rem', position: 'relative' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
          <Icons.Search />
        </span>
        <input
          type="text"
          placeholder="Search questions in this chapter…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem',
            border: '1px solid #e2e8f0', borderRadius: '0.75rem',
            fontSize: '0.93rem', fontFamily: 'inherit',
            outline: 'none', background: 'white',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#3b82f6')}
          onBlur={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
        />
      </div>

      <div className="qna-layout">
        {/* Chapter sidebar */}
        <nav className="qna-sidebar" style={{
          background: 'white', border: '1px solid #e2e8f0',
          borderRadius: '1rem', padding: '0.65rem',
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', padding: '0.35rem 0.6rem', marginBottom: '0.3rem', letterSpacing: '0.08em' }}>
            CHAPTERS
          </div>
          {chapters.map(ch => {
            const isActive = ch.name === activeChapter;
            return (
              <button
                key={ch.name}
                onClick={() => setActiveChapter(ch.name)}
                style={{
                  width: '100%', textAlign: 'left', padding: '0.55rem 0.7rem',
                  borderRadius: '0.55rem', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '0.45rem', marginBottom: '0.15rem',
                  background: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? 'white' : '#475569',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'all 0.14s', fontSize: '0.8rem',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', lineHeight: 1.3 }}>
                  <span style={{ flexShrink: 0, marginTop: '2px', color: isActive ? 'white' : '#64748b' }}>
                    <Icons.ChapterIcon iconStr={ch.icon} />
                  </span>
                  <span>{ch.name}</span>
                </span>
                <span style={{
                  fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.4rem',
                  borderRadius: '999px', flexShrink: 0,
                  background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  color: isActive ? 'white' : '#64748b',
                }}>
                  {ch.total}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            marginBottom: '1.1rem', paddingBottom: '0.9rem',
            borderBottom: '2px solid #e2e8f0',
          }}>
            <span style={{ color: '#0f172a' }}>
              {activeMeta && <Icons.ChapterIcon iconStr={activeMeta.icon} />}
            </span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{activeChapter}</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.83rem' }}>
                {loadingQuestions ? 'Loading…' : `${displayed.length} question${displayed.length !== 1 ? 's' : ''}${search ? ` matching "${search}"` : ''}`}
              </p>
            </div>
          </div>

          {loadingQuestions ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              <span style={{ color: '#64748b' }}>Loading questions…</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <ChapterPanel key={activeChapter} questions={displayed} />
          )}
        </div>
      </div>
    </div>
  );
}
