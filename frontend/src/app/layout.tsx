import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Numerical Methods Learner",
  description: "An educational platform for learning and solving numerical methods problems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <aside className="sidebar-nav" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '2rem' }}>
            <h2 className="sidebar-title" style={{ color: 'white', fontSize: '1.5rem' }}>Numerical Methods</h2>
            <nav className="sidebar-nav-links">
              <a href="/" style={{ color: 'var(--border-color)' }}>Home</a>
              <a href="/methods" style={{ color: 'var(--border-color)' }}>Method Explorer</a>
              <a href="/solver" style={{ color: 'var(--border-color)' }}>Problem Solver</a>
              <a href="/past-qna" style={{ color: 'var(--border-color)' }}>Past Q&amp;As</a>
            </nav>
          </aside>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
