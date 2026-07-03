import { useNavigate } from 'react-router-dom'
import './ProjectLabel.css'

export function ProjectsLabels({ projects }) {
  const navigate = useNavigate()
  return (
    <div className="projects-labels">
      {projects.map(project => (
        <div 
          key={project.id}
          className="project-label"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          <span>{project.properties?.["Nome do Projeto"]?.title?.[0]?.text?.content}</span>
        </div>
      ))}
    </div>
  )
}