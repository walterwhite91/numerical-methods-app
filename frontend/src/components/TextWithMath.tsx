'use client';

import React from 'react';
import MathDisplay from './MathDisplay';

interface TextWithMathProps {
  text: string;
}

export default function TextWithMath({ text }: TextWithMathProps) {
  if (!text) return null;

  // Split by $...$ to separate plain text from LaTeX equations
  const parts = text.split(/(\$[^\$]+\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const mathExpr = part.slice(1, -1);
          return <MathDisplay key={index} math={mathExpr} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
