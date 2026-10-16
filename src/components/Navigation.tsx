import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '#about', label: 'About', num: '01' },
  { href: '#projects', label: 'Work', num: '02' },
  { href: '#skills', label: 'Skills', num: '03' },
  { href: '#experience', label: 'Experience', num: '04' },
  { href: '#contact', label: 'Contact', num: '05' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { isAdmin, setShowLogin, logout } = useAdmin();

  const lastScrollYRef = useRef(0);
  const isNavigatingRef = useRef(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const prevScrollY = lastScrollYRef.current;
          const diff = currentScrollY - prevScrollY;

          // 1. Solid background past 10px
          setScrolled(currentScrollY > 10);

          // 2. Hide / show logic
          if (isNavigatingRef.current) {
            // During programmed nav link smooth scrolling, keep nav visible
            setIsVisible(true);
          } else if (currentScrollY <= 80) {
            // Near the top of the page, always show
            setIsVisible(true);
          } else if (Math.abs(diff) >= 8) {
            // Scroll down hides, scroll up shows
            if (diff > 0) {
              setIsVisible(false);
            } else {
              setIsVisible(true);
            }
          }

          lastScrollYRef.current = currentScrollY;

          // Active section highlight tracking
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

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setIsVisible(true);
    isNavigatingRef.current = true;

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    // Reset smooth scroll navigation lock after smooth scrolling completes
    window.setTimeout(() => {
      isNavigatingRef.current = false;
      lastScrollYRef.current = window.scrollY;
    }, 800);
  };

  // Nav is forced visible if near top, if mobile menu is open, or if an item inside has focus
  const showNav = isVisible || isOpen || hasKeyboardFocus;

  return (
    <header
      ref={navRef}
      onFocus={() => setHasKeyboardFocus(true)}
      onBlur={(e) => {
        if (!navRef.current?.contains(e.relatedTarget as Node)) {
          setHasKeyboardFocus(false);
        }
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[transform,background-color,border-color] duration-200 motion-reduce:transition-none ${
        showNav ? 'translate-y-0 ease-out' : '-translate-y-full ease-out'
      } ${
        scrolled
          ? 'bg-bg border-b border-line'
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
            <span className="font-serif text-2xl tracking-tight text-ink font-normal group-hover:opacity-90">
              Sopheaktra Chin
            </span>
            <span className="font-mono text-xs text-muted">/ Portfolio</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`text-sm transition-colors duration-150 py-1 ${
                    isActive
                      ? 'text-accent font-medium border-b border-accent'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className="font-mono text-xs opacity-60 mr-1.5">{link.num}</span>
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle + Social + Admin */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com/PHeaktraaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-wider text-muted hover:text-accent flex items-center gap-1 transition-colors mr-2"
            >
              GitHub
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <ThemeToggle />

            <button
              onClick={() => (isAdmin ? logout() : setShowLogin(true))}
              className={`font-mono text-xs px-2.5 py-1.5 border transition-colors ${
                isAdmin
                  ? 'border-accent text-accent bg-surface'
                  : 'border-line text-muted hover:border-ink hover:text-ink'
              }`}
            >
              {isAdmin ? 'Admin (Exit)' : 'Admin'}
            </button>
          </div>

          {/* Mobile Actions: Theme Toggle + Menu */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => (isAdmin ? logout() : setShowLogin(true))}
              className={`font-mono text-xs px-2 py-1.5 border ${
                isAdmin ? 'border-accent text-accent' : 'border-line text-muted'
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
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`text-lg font-serif transition-colors ${
                      isActive ? 'text-accent font-medium' : 'text-ink hover:text-accent'
                    }`}
                  >
                    <span className="font-mono text-xs opacity-60 mr-3">{link.num}</span>
                    {link.label}
                  </a>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-line flex items-center justify-between text-xs font-mono">
              <a
                href="https://github.com/PHeaktraaa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent flex items-center gap-1"
              >
                GitHub <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/sopheaktrachin-23103a393/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent flex items-center gap-1"
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
