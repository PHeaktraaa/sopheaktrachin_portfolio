import { User, MapPin, Coffee, CircleDot, Compass, Sparkles } from 'lucide-react';

const interests = [
  { icon: CircleDot, label: 'Badminton' },
  { icon: Compass, label: 'Exploring' },
  { icon: Sparkles, label: 'Creativity' },
  { icon: Coffee, label: 'Tea Enthusiast' },
];

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-title gradient-text">About Me</h2>
          <p className="section-subtitle mx-auto">
            Get to know who I am, what I do and what I design.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in-right order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-2xl opacity-50" />
              <div className="relative bg-slate-900/50 rounded-3xl p-8 border border-slate-800/50 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100">Sopheaktra Chin</h3>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>Phnom Penh, Cambodia</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    I am an entry level Graphic Designer, who is passionate about creativity and design. 
                    At present, I am looking for new challenges and opportunities that would help me develop as a professional and gain experience in the industry. 
                    I love to explore different ways of design creation, learn more about the latest trends in design and improve myself on each new project that comes up.
                  </p>
                  <p>
                    I have developed a set of skills and abilities that are going to help me do the best job possible on every task I am assigned and create unique, high quality design solutions for my clients.
                    I am excited to help bring new ideas and innovative solutions to any project I work on as well as work as part of a team with all of my co-workers and clients.
                    My goal is to design along with you through creative visually engaging designs which will exceed expectations and leave your company and brand with an original and lasting impression.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Things I Love
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {interests.map((interest) => (
                      <div
                        key={interest.label}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-primary-500/30 transition-colors"
                      >
                        <interest.icon className="w-5 h-5 text-primary-400" />
                        <span className="text-sm text-slate-300">{interest.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-left order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent-500/20 to-primary-500/20 rounded-3xl blur-2xl opacity-50" />
              <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-slate-800">
                <img
                  src="/tra.jpg"
                  alt="Profile Photo"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-slate-200 font-medium">Available for opportunities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
