import { useState, useEffect } from 'react';
import { Menu, X, Code2, Github, Linkedin, Mail } from 'lucide-react';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navLinks.map(link => link.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center gap-2 group"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-100 group-hover:text-primary-400 transition-colors">
              Sopheaktra<span className="text-primary-400">Chin</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeSection === link.href.slice(1)
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/PHeaktraaa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all duration-300"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/sopheaktra-chin-23103a393/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all duration-300"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:pheaktrachen141@gmail.com"
              className="p-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all duration-300"
              aria-label="Send Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeSection === link.href.slice(1)
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
              <a
                href="https://github.com/PHeaktraaa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/sopheaktra-chin-23103a393/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:pheaktrachen141@gmail.com"
                className="p-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
