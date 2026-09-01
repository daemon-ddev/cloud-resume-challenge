const icons = {
  Browser: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="2" y1="8.5" x2="22" y2="8.5" />
      <circle cx="5.5" cy="6.25" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="8" cy="6.25" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  'Azure Static Web Apps': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 18a4 4 0 01-.5-7.97 5 5 0 019.9-1.24A4.5 4.5 0 0117.5 18H7z" />
    </svg>
  ),
  'Azure Function': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  ),
  'Azure Table Storage': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14a8 3 0 0016 0V5" />
      <path d="M4 12a8 3 0 0016 0" />
    </svg>
  ),
};

function Connector() {
  return (
    <svg className="arch-connector" viewBox="0 0 48 16" fill="none">
      <line x1="0" y1="8" x2="38" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M34 3 42 8 34 13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function ArchitectureDiagram({ nodes }) {
  return (
    <div className="arch-diagram" role="img" aria-label={`Architecture: ${nodes.join(' to ')}`}>
      {nodes.map((node, i) => (
        <div className="arch-step" key={node}>
          <div className="arch-node">
            <span className="arch-icon" aria-hidden="true">{icons[node]}</span>
            <span className="arch-label">{node}</span>
          </div>
          {i < nodes.length - 1 && <Connector />}
        </div>
      ))}
    </div>
  );
}

export default ArchitectureDiagram;
