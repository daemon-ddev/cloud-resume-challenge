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
        <a href="REPLACE_WITH_YOUR_LINKEDIN_URL" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="mailto:REPLACE_WITH_YOUR_EMAIL">Email</a>
      </div>
      {!failed && (
        <p className="visitor-count">
          Visitors: {count === null ? '—' : count}
        </p>
      )}
    </footer>
  );
}

export default Footer;
