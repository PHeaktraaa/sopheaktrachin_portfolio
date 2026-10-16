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
    <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-28 bg-band border-b border-line">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Hero Column */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
                Portfolio &mdash; Phnom Penh, Cambodia
              </p>

              <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-ink font-normal leading-[1.02] mb-8">
                Sopheaktra
                <br />
                Chin
              </h1>

              <div className="max-w-2xl">
                <p className="text-xl sm:text-2xl text-ink font-light leading-snug mb-5">
                  Software engineering student and <span className="text-accent font-normal">graphic designer</span> building web systems and visual identities.
                </p>
                <p className="text-muted text-base sm:text-lg leading-relaxed mb-10 max-w-[65ch]">
                  I build database-backed web applications with React, TypeScript, and Supabase, alongside editorial design systems.
                </p>
              </div>
            </div>

            {/* Actions: View work as accent button, Download resume as text link */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <button
                onClick={() => scrollToSection('projects')}
                className="btn-primary"
              >
                View work
                <ArrowDown className="w-4 h-4 ml-1" />
              </button>

              <a
                href="/Resume_SopheaktraChin.pdf"
                download
                className="text-sm font-medium text-ink hover:text-accent border-b border-line hover:border-accent pb-0.5 inline-flex items-center gap-1.5 transition-colors"
              >
                Download resume
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

          {/* Right Column: Asymmetric Photo with thin offset outline + Live Mono Stats */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="relative">
              {/* Thin offset outline for human-designed editorial feel */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 border border-line -z-0" />
              <div className="relative border border-line bg-surface p-2.5 z-10">
                <div className="aspect-[4/5] overflow-hidden bg-bg relative">
                  <img
                    src="/tra.jpg"
                    alt="Sopheaktra Chin portrait"
                    className="w-full h-full object-cover object-top filter grayscale contrast-105 hover:filter-none transition-[filter] duration-300"
                  />
                </div>
                <div className="pt-3 flex items-center justify-between text-xs font-mono text-muted">
                  <span>Figure 01. Portrait</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                    Available for work
                  </span>
                </div>
              </div>
            </div>

            {/* Live Numbers Strip (Realtime updates) */}
            <div className="grid grid-cols-3 border-t border-b border-line py-4 bg-surface/50 px-2">
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-normal text-ink">
                  {loading ? '—' : String(projectsCompleted).padStart(2, '0')}
                </div>
                <div className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">
                  Projects
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-normal text-ink">
                  {loading ? '—' : String(technologiesCount).padStart(2, '0')}
                </div>
                <div className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">
                  Skills
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-normal text-ink">
                  02+
                </div>
                <div className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">
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