'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { categories, methodsData } from '@/lib/methodData';
import MathDisplay from '@/components/MathDisplay';
import TextWithMath from '@/components/TextWithMath';

function MethodExplorerContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'root-finding';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMethod, setSelectedMethod] = useState('');

  // Get methods matching selected category
  const filteredMethods = Object.values(methodsData).filter(
    (m) => m.category === selectedCategory
  );

  useEffect(() => {
    if (filteredMethods.length > 0) {
      setSelectedMethod(filteredMethods[0].id);
    } else {
      setSelectedMethod('');
    }
  }, [selectedCategory]);

  const method = methodsData[selectedMethod];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', minHeight: '80vh' }}>
      {/* Local Navigation sidebar */}
      <aside style={{ borderRight: '1px solid var(--border-color)', paddingRight: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Categories</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem 0.75rem',
                  background: selectedCategory === cat.id ? '#e2e8f0' : 'none',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: selectedCategory === cat.id ? '600' : '400',
                  color: selectedCategory === cat.id ? 'var(--primary-color)' : 'var(--text-secondary)'
                }}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>

        {filteredMethods.length > 0 && (
          <>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Methods</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filteredMethods.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => setSelectedMethod(m.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      background: selectedMethod === m.id ? 'var(--accent-color)' : 'none',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontWeight: selectedMethod === m.id ? '600' : '400',
                      color: selectedMethod === m.id ? '#fff' : 'var(--text-secondary)'
                    }}
                  >
                    {m.name}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>

      {/* Concept details */}
      <section style={{ paddingLeft: '1rem' }}>
        {method ? (
          <div>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{method.name}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '2rem' }}>
              <TextWithMath text={method.definition} />
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Mathematical Formula</h2>
              <div className="math-container">
                <MathDisplay math={method.formula} block />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Algorithm Steps</h2>
              <ol style={{ paddingLeft: '1.5rem', color: 'var(--text-primary)' }}>
                {method.algorithm.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    <TextWithMath text={step} />
                  </li>
                ))}
              </ol>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Conditions & Limitations</h2>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                  {method.conditions.map((cond, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>
                      <TextWithMath text={cond} />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Typical Use Cases</h2>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                  {method.useCases.map((use, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>
                      <TextWithMath text={use} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', backgroundColor: '#fff' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Example Problem</h2>
              <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                <TextWithMath text={method.example.problem} />
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <TextWithMath text={method.example.solution} />
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>
            Please select a numerical method from the sidebar.
          </div>
        )}
      </section>
    </div>
  );
}

export default function MethodExplorer() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>Loading method explorer...</div>}>
      <MethodExplorerContent />
    </Suspense>
  );
}
