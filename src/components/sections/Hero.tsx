import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useProjects, useSkills } from '../../hooks/useData';

export function Hero() {
  const { projects, loading: projectsLoading } = useProjects();
  const { skills, loading: skillsLoading } = useSkills();

  const projectsCompleted = projects.length;
  const technologiesCount = skills.length;
  const loading = projectsLoading || skillsLoading;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-28 border-b border-line">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Hero Column */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-6">
                Portfolio &mdash; Phnom Penh, Cambodia
              </p>

              <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-ink font-normal leading-[1.02] mb-8">
                Sopheaktra
                <br />
                Chin
              </h1>

              <div className="max-w-2xl">
                <p className="text-xl sm:text-2xl text-ink font-light leading-snug mb-6">
                  Software engineering student and graphic designer building web systems and visual identities.
                </p>
                <p className="text-ink-muted text-base sm:text-lg leading-relaxed mb-10">
                  Focusing on clean database-backed web applications with React and Supabase, alongside editorial design and brand systems.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => scrollToSection('projects')}
                className="btn-primary"
              >
                Selected Work
                <ArrowDown className="w-4 h-4" />
              </button>

              <a
                href="/Resume_SopheaktraChin.pdf"
                download
                className="btn-secondary"
              >
                Download Resume
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => scrollToSection('contact')}
                className="btn-ghost"
              >
                Get in touch &rarr;
              </button>
            </div>
          </div>

          {/* Right Column: Asymmetric Photo & Live Metadata */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="relative border border-line bg-white p-3">
              <div className="aspect-[4/5] overflow-hidden bg-bg-subtle relative">
                <img
                  src="/tra.jpg"
                  alt="Sopheaktra Chin portrait"
                  className="w-full h-full object-cover object-top filter grayscale contrast-105 hover:filter-none transition-[filter] duration-300"
                />
              </div>
              <div className="pt-3 flex items-center justify-between text-xs font-mono text-ink-muted">
                <span>Figure 01. Portrait</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                  Available for work
                </span>
              </div>
            </div>

            {/* Live Numbers Strip */}
            <div className="grid grid-cols-3 border-t border-b border-line py-4">
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-normal text-ink">
                  {loading ? '—' : String(projectsCompleted).padStart(2, '0')}
                </div>
                <div className="font-mono text-[11px] text-ink-muted uppercase tracking-wider mt-1">
                  Projects
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-normal text-ink">
                  {loading ? '—' : String(technologiesCount).padStart(2, '0')}
                </div>
                <div className="font-mono text-[11px] text-ink-muted uppercase tracking-wider mt-1">
                  Skills
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-normal text-ink">
                  02+
                </div>
                <div className="font-mono text-[11px] text-ink-muted uppercase tracking-wider mt-1">
                  Years Study
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}