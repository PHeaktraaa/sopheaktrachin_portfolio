import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-12 bg-bg text-ink">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-6 font-mono text-xs text-muted">
          <div>
            <span className="text-ink font-serif text-sm font-normal mr-2">
              Sopheaktra Chin
            </span>
            <span>&copy; {currentYear} &mdash; Phnom Penh</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/PHeaktraaa"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent flex items-center gap-1 transition-colors"
            >
              GitHub <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://www.linkedin.com/in/sopheaktrachin-23103a393/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent flex items-center gap-1 transition-colors"
            >
              LinkedIn <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-ink transition-colors"
            >
              Back to top &uarr;
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}