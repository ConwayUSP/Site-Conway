import { fetchNotion, notionPropertyIds } from '../../server/notion.mjs'

export default async function handler(req, res) {
  try {
    const { id } = req.query
    const resp = await fetchNotion(`pages/${id}`, {
      propertyIds: notionPropertyIds.projects,
      method: 'GET',
    })

    const data = await resp.json()
    res.status(200).json({
      id: data.id,
      icon: data.icon?.emoji,
      properties: data.properties,
      cover: data.cover
    })
  } catch (error) {
    console.error('Error fetching member:', error)
    res.status(500).json({ error: 'Failed to fetch member' })
  }
}
