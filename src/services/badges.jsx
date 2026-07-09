export async function getBadge(id) {
  const response = await fetch(`/api/badges/${id}`)
  const data = await response.json()
  
  return data
}

export async function getBadges() {
  const response = await fetch('/api/badges')
  const data = await response.json()
  
  return data
}