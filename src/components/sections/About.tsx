export function About() {
  const highlights = [
    { label: 'Location', value: 'Phnom Penh, Cambodia' },
    { label: 'Role', value: 'Software Engineering Student & Graphic Designer' },
    { label: 'Focus', value: 'Full-stack Web Systems, Typography, Identity' },
    { label: 'Interests', value: 'Badminton, Tea, Spatial Explorations' },
  ];

  return (
    <section id="about" className="py-24 md:py-32 border-b border-line">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 pb-6 border-b border-line gap-4">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-ink-soft">01</span>
            <h2 className="section-title">About</h2>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            Background &amp; Intent
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-ink leading-tight mb-4">
              Building practical software with an eye for typography and structure.
            </h3>
            <p className="text-sm font-mono text-ink-muted">
              Engineering discipline combined with graphic design fundamentals.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-ink-muted leading-relaxed font-light">
            <p>
              I am a software engineering student based in Phnom Penh with a practical background in graphic design.
              My work sits at the intersection of clean database architecture and straightforward, intentional visual systems.
            </p>
            <p>
              Rather than assembling decorative surfaces, I focus on understanding data models, state flows, and typography that communicates clearly.
              Whether implementing full CRUD workflows backed by PostgreSQL Row Level Security or drafting brand materials, I prefer honest tools, fast interfaces, and durable decisions over short-lived trends.
            </p>
            <p>
              Currently expanding my experience across relational data modeling, modern React patterns, and production deployment on cloud infrastructure.
            </p>

            {/* Structured Table */}
            <div className="pt-8 mt-8 border-t border-line">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {highlights.map((item) => (
                  <div key={item.label} className="border-b border-line pb-4">
                    <dt className="font-mono text-xs uppercase tracking-wider text-ink-soft mb-1">
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
