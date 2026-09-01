const steps = [
  {
    label: 'Cloud AI Fundamentals',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M7 18a4 4 0 01-.5-7.97 5 5 0 019.9-1.24A4.5 4.5 0 0117.5 18H7z" />
        <path d="M12 8.6l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" />
      </svg>
    ),
  },
  {
    label: 'Python & ML Fundamentals',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="6" cy="6.5" r="2" />
        <circle cx="18" cy="6.5" r="2" />
        <circle cx="12" cy="18" r="2" />
        <path d="M7.7 7.8 10.5 16.3" />
        <path d="M16.3 7.8 13.5 16.3" />
        <path d="M8 6.5h8" />
      </svg>
    ),
  },
  {
    label: 'Kubernetes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M12 2 21 7v10l-9 5-9-5V7z" />
        <path d="M3 7l9 5 9-5" />
        <path d="M12 12v9" />
      </svg>
    ),
  },
  {
    label: 'Infrastructure as Code (Terraform)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9.5 9 6.5 12 9.5 15" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.5 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'ML Pipelines & Experiment Tracking',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="9.5" width="5" height="5" />
        <rect x="15.5" y="9.5" width="5" height="5" />
        <path d="M7 12h8.5" />
        <path d="M12 9.5V7a2 2 0 012-2h1.5" />
      </svg>
    ),
  },
  {
    label: 'Model Deployment & Monitoring',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 18a8 8 0 1116 0" />
        <path d="M12 18l4.5-6.5" />
      </svg>
    ),
  },
];

function Connector() {
  return (
    <svg className="arch-connector" viewBox="0 0 48 16" fill="none">
      <line x1="0" y1="8" x2="38" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M34 3 42 8 34 13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const rows = [steps.slice(0, 3), steps.slice(3)];

function Roadmap() {
  return (
    <div
      className="roadmap"
      role="img"
      aria-label={`Roadmap: ${steps.map((s) => s.label).join(' to ')}`}
    >
      {rows.map((row, rowIndex) => (
        <div className="arch-diagram" key={rowIndex}>
          {row.map((step, i) => (
            <div className="arch-step" key={step.label}>
              <div className="arch-node">
                <span className="arch-icon" aria-hidden="true">{step.icon}</span>
                <span className="arch-label">{step.label}</span>
              </div>
              {i < row.length - 1 && <Connector />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Roadmap;
