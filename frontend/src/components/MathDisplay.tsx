'use client';

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

interface MathDisplayProps {
  math: string;
  block?: boolean;
}

export default function MathDisplay({ math, block = false }: MathDisplayProps) {
  try {
    if (block) {
      return <BlockMath math={math} />;
    }
    return <InlineMath math={math} />;
  } catch (error) {
    return <span style={{ color: 'var(--accent-color)' }}>{math}</span>;
  }
}
