const skills = [
  'Azure Fundamentals & Core Services',
  'Azure Storage',
  'Infrastructure as Code (Bicep)',
  'CI/CD (GitHub Actions)',
  'Cost Management & Governance',
  'React',
  'Node.js',
  'Git & GitHub',
];

function About() {
  return (
    <section className="section" id="about">
      <h2>About</h2>
      <p>
        I'm Guled Jama, a software engineer moving from a career in sales
        into cloud and DevOps. I trained as a software engineer with La
        Fosse Academy, then focused my learning on Azure — working through
        the Azure Fundamentals (AZ-900) material and now preparing for the
        AZ-104 (Azure Administrator Associate) exam.
      </p>
      <h3>Skills</h3>
      <ul className="skills-grid">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}

export default About;
