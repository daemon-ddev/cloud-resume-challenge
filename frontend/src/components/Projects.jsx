const projects = [
  {
    name: 'Cloud Resume Challenge',
    description:
      'This site: a React frontend and a serverless visitor counter, deployed to Azure Static Web Apps with infrastructure defined in Bicep and CI/CD via GitHub Actions.',
    repoUrl: 'https://github.com/daemon-ddev/cloud-resume-challenge',
    diagram: ['Browser', 'Static Web App', 'Function', 'Table Storage'],
  },
  {
    name: 'AgroSense (Team Project)',
    description:
      'Mobile app for UK small farms to manage fields, log crop observations, and receive AI-powered recommendations based on live weather and soil conditions. Built collaboratively during my software engineering training at La Fosse Academy.',
    repoUrl: null,
  },
];

function Projects() {
  return (
    <section className="section" id="projects">
      <h2>Projects</h2>
      <div className="project-list">
        {projects.map((project) => (
          <div className="project-card" key={project.name}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            {project.diagram && (
              <div className="arch-diagram">
                {project.diagram.map((node, i) => (
                  <span key={node}>
                    <span className="arch-node">{node}</span>
                    {i < project.diagram.length - 1 && (
                      <span className="arch-arrow">&rarr;</span>
                    )}
                  </span>
                ))}
              </div>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
