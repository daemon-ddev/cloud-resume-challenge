const skills = [
  'Microsoft Azure Fundamentals (AZ-900)',
  'Cloud Concepts',
  'Azure Core Services',
  'Azure Storage',
  'Cost Management & Governance',
  'React',
  'Node.js',
  'Git & GitHub Actions',
];

function About() {
  return (
    <section className="section" id="about">
      <h2>About</h2>
      <p>
        Replace this paragraph with a short bio: who you are, what you're
        learning, and what you're aiming for next in cloud computing.
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
