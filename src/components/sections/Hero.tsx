import { ChevronDown, Download, ArrowRight, Sparkles } from 'lucide-react';
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
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span className="text-sm text-slate-300">Welcome to my portfolio</span>
          </div>
        </div>

        <h1 className="animate-fade-in-up opacity-0 animate-delay-100">
          <span className="block text-5xl sm:text-6xl md:text-7xl font-bold mb-4">
            <span className="text-slate-100">Hi, I'm </span>
            <span className="gradient-text">Sopheaktra Chin</span>
          </span>
        </h1>

        <div className="animate-fade-in-up opacity-0 animate-delay-200">
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-400 font-light mb-6">
            Software Engineering Student & <span className="text-primary-400">Graphic Designer</span>
          </p>
        </div>

        <div className="animate-fade-in-up opacity-0 animate-delay-300 max-w-2xl mx-auto">
          <p className="text-lg text-slate-500 mb-10 leading-relaxed">
            I create beautiful, functional digital experiences that make a difference.
          </p>
        </div>

        <div className="animate-fade-in-up opacity-0 animate-delay-400 flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => scrollToSection('projects')}
            className="btn-primary group"
          >
            View My Work
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="public/Resume_SopheaktraChin.pdf"
            download
            className="btn-secondary group"
          >
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Download Resume
          </a>
        </div>

        <div className="animate-fade-in-up opacity-0 animate-delay-500 flex items-center justify-center gap-8 text-slate-500">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-100 mb-1">
              {loading ? '—' : projectsCompleted}
            </div>
            <div className="text-sm">Projects Completed</div>
          </div>
          <div className="w-px h-12 bg-slate-700" />
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-100 mb-1">
              {loading ? '—' : technologiesCount}
            </div>
            <div className="text-sm">Technologies</div>
          </div>
          <div className="w-px h-12 bg-slate-700" />
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-100 mb-1">2+</div>
            <div className="text-sm">Years Learning</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollToSection('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle text-slate-400 hover:text-primary-400 transition-colors"
        aria-label="Scroll to about section"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}