import React from 'react';
import { categories } from '@/lib/methodData';

export default function HomePage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '1rem' }}>
          Numerical Methods Learner
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          An interactive companion for mastering numerical computations. Learn the math, review algorithm steps, and verify your solutions step-by-step.
        </p>
      </header>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>Explore Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <div key={cat.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{cat.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Learn root finding, differential equations, integration systems, and linear solutions.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a href={`/methods?category=${cat.id}`} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  Theory
                </a>
                <a href={`/solver?category=${cat.id}`} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', color: 'white' }}>
                  Solve
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ready to solve a problem?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
          Input your functions, parameters, and boundary values directly into our solver to see every iteration table and mathematical step.
        </p>
        <a href="/solver" className="btn btn-primary" style={{ color: 'white' }}>
          Go to Problem Solver
        </a>
      </section>
    </div>
  );
}
