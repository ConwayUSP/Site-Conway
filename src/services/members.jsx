export async function getMember(id) {
  const response = await fetch(`/api/members/${id}`)
  const data = await response.json()
  
  return data
}