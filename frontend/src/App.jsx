import Hero from './components/Hero';
import About from './components/About';
import Certifications from './components/Certifications';
import Journey from './components/Journey';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <>
      <nav className="nav">
        <a href="#about">About</a>
        <a href="#certifications">Certifications</a>
        <a href="#journey">Journey</a>
        <a href="#projects">Projects</a>
      </nav>
      <Hero />
      <About />
      <Certifications />
      <Journey />
      <Projects />
      <Footer />
    </>
  );
}

export default App;
