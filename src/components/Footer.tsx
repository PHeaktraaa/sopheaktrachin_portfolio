import { Code2, Heart, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-800/50 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <a href="#home" className="flex items-center gap-2 group mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-100">
                Sopheaktra<span className="text-primary-400">Chin</span>
              </span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed">
              A passionate software engineering student building modern web applications
              with React, Node.js, and cloud technologies.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-slate-400 hover:text-primary-400 transition-colors text-sm"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-4">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com/PHeaktraaa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/sopheaktra-chin-23103a393/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:pheaktrachen141@gmail.com"
                className="p-2.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} Sopheaktra Chin. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-red-400" /> using React & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}