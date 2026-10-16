import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const navLinks = [
  { href: '#about', label: 'About', num: '01' },
  { href: '#skills', label: 'Skills', num: '02' },
  { href: '#projects', label: 'Work', num: '03' },
  { href: '#experience', label: 'Background', num: '04' },
  { href: '#contact', label: 'Contact', num: '05' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { isAdmin, setShowLogin, logout } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navLinks.map((link) => link.href.slice(1));
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 180) {
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-md border-b border-line'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Monogram */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-baseline gap-2 group"
          >
            <span className="font-serif text-2xl tracking-tight text-ink font-normal">
              Sopheaktra Chin
            </span>
            <span className="font-mono text-xs text-ink-muted">/ Portfolio</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`text-sm transition-colors duration-150 py-1 ${
                  activeSection === link.href.slice(1)
                    ? 'text-ink font-medium border-b border-ink'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <span className="font-mono text-xs text-ink-soft mr-1.5">{link.num}</span>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions: Social + Admin Trigger */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="https://github.com/PHeaktraaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink flex items-center gap-1 transition-colors"
            >
              GitHub
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => (isAdmin ? logout() : setShowLogin(true))}
              className={`font-mono text-xs px-2.5 py-1 border transition-colors ${
                isAdmin
                  ? 'border-accent text-accent bg-accent-light'
                  : 'border-line text-ink-muted hover:border-ink hover:text-ink'
              }`}
            >
              {isAdmin ? 'Admin (Exit)' : 'Admin'}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => (isAdmin ? logout() : setShowLogin(true))}
              className={`font-mono text-xs px-2 py-1 border ${
                isAdmin ? 'border-accent text-accent' : 'border-line text-ink-muted'
              }`}
            >
              {isAdmin ? 'Exit' : 'Admin'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-ink hover:text-accent transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-line bg-bg">
            <nav className="flex flex-col gap-4 mb-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`text-lg font-serif transition-colors ${
                    activeSection === link.href.slice(1)
                      ? 'text-accent font-medium'
                      : 'text-ink hover:text-accent'
                  }`}
                >
                  <span className="font-mono text-xs text-ink-soft mr-3">{link.num}</span>
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-4 border-t border-line flex items-center gap-6 text-xs font-mono">
              <a
                href="https://github.com/PHeaktraaa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted hover:text-ink flex items-center gap-1"
              >
                GitHub <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/sopheaktrachin-23103a393/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted hover:text-ink flex items-center gap-1"
              >
                LinkedIn <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
