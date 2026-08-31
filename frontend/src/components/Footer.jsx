import { useEffect, useState } from 'react';

function Footer() {
  const [count, setCount] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/api/counter')
      .then((res) => {
        if (!res.ok) throw new Error('request failed');
        return res.json();
      })
      .then((data) => setCount(data.count))
      .catch(() => setFailed(true));
  }, []);

  return (
    <footer className="section footer">
      <div className="footer-links">
        <a href="https://github.com/daemon-ddev" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/guled-jama-0b831b220/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="mailto:guledjama.dev@gmail.com">Email</a>
      </div>
      {!failed && (
        <div className="visitor-count">
          <span className="label">Visitor Count</span>
          <span className="value">{count === null ? '----' : String(count).padStart(4, '0')}</span>
        </div>
      )}
    </footer>
  );
}

export default Footer;
