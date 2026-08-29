const projects = [
  {
    name: 'Cloud Resume Challenge',
    description:
      'This site: a React frontend and a serverless visitor counter, deployed to Azure Static Web Apps with infrastructure defined in Bicep and CI/CD via GitHub Actions.',
    repoUrl: 'https://github.com/daemon-ddev/REPLACE_WITH_REPO_NAME',
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
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
