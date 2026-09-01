import { useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Journey from './components/Journey';
import WhereImHeaded from './components/WhereImHeaded';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';

function App() {
  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav className="nav">
        <a href="#about">About</a>
        <a href="#journey">Journey</a>
        <a href="#where-im-headed">Where I'm Headed</a>
        <a href="#projects">Projects</a>
      </nav>
      <Hero />
      <About />
      <Journey />
      <WhereImHeaded />
      <Projects />
      <Footer />
    </>
  );
}

export default App;
