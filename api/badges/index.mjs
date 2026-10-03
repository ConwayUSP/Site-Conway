import { fetchNotion, notionPropertyIds } from '../../server/notion.mjs'

export default async function handler(req, res) {
  try {
    const projectsID = '2abb02a6-eb6d-814e-b53d-000bb2e88876'
    const resp = await fetchNotion(`data_sources/${projectsID}/query`, {
      propertyIds: notionPropertyIds.badges,
      method: 'POST',
      body: JSON.stringify({})
    })
  
    const data = await resp.json()
    res.status(200).json(data.results.map(r => {
      return { 
        id: r.id,
        icon: r.icon?.custom_emoji?.url || r.icon?.file?.url,
        name: r.properties?.["Name"]?.title?.[0]?.text?.content
      }
    }))
  } catch (error) {
    console.error('Error fetching badges:', error)
    res.status(500).json({ error: 'Failed to fetch badges' })
  }
}
