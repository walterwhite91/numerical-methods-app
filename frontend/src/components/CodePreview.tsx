'use client';

import React from 'react';

// Small set of Python keywords worth color-coding for a classroom demo.
const KEYWORDS = new Set([
  'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'import',
  'from', 'as', 'in', 'not', 'and', 'or', 'is', 'lambda', 'pass', 'break',
  'continue', 'try', 'except', 'raise', 'with', 'yield', 'global',
  'nonlocal', 'assert', 'del', 'None', 'True', 'False',
]);

// Matches (in priority order): triple-quoted strings, single-line strings,
// comments, numbers, identifiers/keywords. Triple-quoted strings use
// [\s\S] so they can span multiple lines (a plain "." can't match "\n").
const TOKEN_REGEX = /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(#.*)|(\b\d+\.?\d*\b)|([A-Za-z_][A-Za-z0-9_]*)/g;

type TokenType = 'string' | 'comment' | 'number' | 'keyword' | 'plain';

const TOKEN_COLORS: Record<TokenType, string> = {
  comment: '#6b7280',
  string: '#15803d',
  number: '#b45309',
  keyword: '#7c3aed',
  plain: 'inherit',
};

interface Token {
  text: string;
  type: TokenType;
}

// Tokenize the whole file in one pass so multi-line constructs (docstrings)
// are recognized correctly, instead of being cut apart by a per-line split.
function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, match.index), type: 'plain' });
    }

    const [full, string, comment, number, identifier] = match;
    let type: TokenType = 'plain';
    if (string) type = 'string';
    else if (comment) type = 'comment';
    else if (number) type = 'number';
    else if (identifier && KEYWORDS.has(identifier)) type = 'keyword';

    tokens.push({ text: full, type });
    lastIndex = match.index + full.length;
  }

  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), type: 'plain' });
  }

  return tokens;
}

// Splits the flat token stream into per-line arrays of React nodes,
// breaking any token that itself contains a newline (e.g. a docstring).
function tokensToLines(tokens: Token[]): React.ReactNode[][] {
  const lines: React.ReactNode[][] = [[]];
  let key = 0;

  for (const token of tokens) {
    const parts = token.text.split('\n');
    parts.forEach((part, i) => {
      if (part.length > 0) {
        lines[lines.length - 1].push(
          <span key={key++} style={{ color: TOKEN_COLORS[token.type], fontStyle: token.type === 'comment' ? 'italic' : 'normal' }}>
            {part}
          </span>
        );
      }
      if (i < parts.length - 1) {
        lines.push([]);
      }
    });
  }

  return lines;
}

export default function CodePreview({ code }: { code: string }) {
  const trimmed = code.replace(/\n$/, '');
  const lines = tokensToLines(tokenize(trimmed));

  return (
    <div
      className="code-block"
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: '#0f172a',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        maxWidth: '100%',
        fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
        lineHeight: '1.5',
      }}
    >
      <pre style={{ margin: 0, padding: '1rem 0' }}>
        {lines.map((lineNodes, idx) => (
          <div key={idx} style={{ display: 'flex' }}>
            <span
              style={{
                userSelect: 'none',
                color: '#475569',
                textAlign: 'right',
                minWidth: '2.5rem',
                paddingRight: '1rem',
                flexShrink: 0,
              }}
            >
              {idx + 1}
            </span>
            <code style={{ color: '#e2e8f0', whiteSpace: 'pre' }}>{lineNodes}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}
