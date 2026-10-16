import { Navigation } from './components/Navigation';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { ExperienceSection } from './components/sections/Experience';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/Footer';
import { AdminProvider } from './contexts/AdminContext';
import { AdminLoginModal } from './components/AdminLoginModal';

function App() {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-bg text-ink selection:bg-accent/20 selection:text-ink">
        <Navigation />

        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <ExperienceSection />
          <Contact />
        </main>

        <Footer />

        <AdminLoginModal />
      </div>
    </AdminProvider>
  );
}

export default App;