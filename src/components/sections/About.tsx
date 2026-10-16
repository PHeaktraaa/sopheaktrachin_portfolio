export function About() {
  const highlights = [
    { label: 'Location', value: 'Phnom Penh, Cambodia' },
    { label: 'Role', value: 'Software Engineering Student & Graphic Designer' },
    { label: 'Stack & Focus', value: 'React, TypeScript, Supabase, Editorial & Brand Design' },
    { label: 'Current Studies', value: 'Web Development & Cloud Computing' },
  ];

  return (
    <section id="about" className="py-24 md:py-32 border-b border-line bg-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 pb-6 border-b border-line gap-4">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-accent">01</span>
            <h2 className="section-title">About</h2>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            01 / Background
          </p>
        </div>

        {/* Two-column layout on desktop: heading left, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-ink leading-tight mb-4">
              Building software systems with visual clarity and engineering discipline.
            </h3>
            <p className="text-sm font-mono text-muted">
              Honest code, relational databases, and typography.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-ink font-light leading-relaxed max-w-[65ch]">
            <p>
              I am a software engineering student based in Phnom Penh with practical experience in graphic design.
              My work combines database design and frontend development with clean layout and typography.
            </p>
            <p>
              I focus on the fundamentals: relational data modeling in PostgreSQL, secure API interactions with Row Level Security, and responsive interfaces that load fast.
              I avoid ornamental fluff and short-lived UI gimmicks, prioritizing clarity, accessibility, and longevity.
            </p>
            <p>
              Outside of coursework, I experiment with brand identity systems, typography pairings, and full-stack side projects deployed on cloud platforms.
            </p>

            {/* Metadata Table */}
            <div className="pt-8 mt-8 border-t border-line">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {highlights.map((item) => (
                  <div key={item.label} className="border-b border-line pb-4">
                    <dt className="font-mono text-xs uppercase tracking-wider text-muted mb-1">
                      {item.label}
                    </dt>
                    <dd className="font-sans text-sm text-ink font-medium">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
