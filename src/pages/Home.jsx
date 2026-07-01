import { useEffect } from 'react'
import './Home.css'

// Hooks
import { useProjects } from '../hooks/useProjects'
import { ProjectsCards } from '../components/projects/ProjectCard'

function Home() {
  const { data, isLoading, isFetching } = useProjects()

  console.log(data)

  return (
    <main className="home">
      <h1>Home do site da Conway!</h1>
      <ProjectsCards projects={data || []} />
    </main>
  )
}

export default Home