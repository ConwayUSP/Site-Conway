import './ProjectCard.css'

export function ProjectsCards({ projects }) {
  return (
    <div className="projects-cards">
      {projects && projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          cover={project.cover} 
          properties={project.properties} 
          icon={project.icon}
        />
      ))}
    </div>
  )
}

export function ProjectCard({ cover, properties, icon }) {
  const projectName = properties?.["Nome do Projeto"]?.title?.[0]?.text?.content
  return (
    <div 
      className="project-card"
    >
      <img src={cover} alt={properties?.Nome?.title[0]?.text?.content || 'Project Cover'} />
      <div 
        className="project-card-content" 
        style={{ "--icon": `"${icon}"` }}
      >
        <h2>{projectName}</h2>
      </div>
    </div>
  )
}