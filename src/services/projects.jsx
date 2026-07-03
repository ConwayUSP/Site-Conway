export async function getProject(id) {
  const response = await fetch(`/api/projects/${id}`)
  const data = await response.json()
  
  return data
}

export async function getProjects() {
  const response = await fetch('/api/projects')
  const data = await response.json()
  
  return data
}