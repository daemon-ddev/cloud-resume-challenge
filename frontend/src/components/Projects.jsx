import ArchitectureDiagram from './ArchitectureDiagram';

const projects = [
  {
    name: 'Cloud CV Challenge',
    description:
      'This site: a React frontend and a serverless visitor counter, deployed to Azure Static Web Apps with infrastructure defined in Bicep and CI/CD via GitHub Actions.',
    repoUrl: 'https://github.com/daemon-ddev/cloud-resume-challenge',
    diagram: ['Browser', 'Azure Static Web Apps', 'Azure Function', 'Azure Table Storage'],
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
            {project.diagram && <ArchitectureDiagram nodes={project.diagram} />}
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
