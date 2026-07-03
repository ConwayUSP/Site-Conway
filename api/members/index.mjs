export default async function handler(req, res) {
  try {
    const projectsID = '2abb02a6-eb6d-817a-a8db-000bb0190ffb'
    const resp = await fetch(`https://api.notion.com/v1/data_sources/${projectsID}/query`, {
      method: 'POST',
      headers: {
        'Notion-Version': '2026-03-11',
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filter: {
          and: [
            {
              property: 'Status',
              status: {
                equals: 'Ativo'
              }
            },
            {
              property: 'Cargo',
              select: {
                does_not_equal: 'Especial'
              }
            },
            {
              property: 'Cargo',
              select: {
                does_not_equal: 'Professor'
              }
            }
          ]
        }
      })
    })
  
    const data = await resp.json()
    res.status(200).json(data.results.map(r => {
      return { 
        id: r.id,
        icon: r.icon?.emoji,
        properties: r.properties 
      }
    }))
  } catch (error) {
    console.error('Error fetching members:', error)
    res.status(500).json({ error: 'Failed to fetch members' })
  }
}