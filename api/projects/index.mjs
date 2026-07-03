export default async function handler(req, res) {
  try {
    const projectsID = '2abb02a6-eb6d-8195-b370-000b6082b00d'
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
              property: 'Trilha?',
              select: {
                equals: 'NÃO'
              } 
            },
            {
              property: 'Status',
              status: {
                does_not_equal: 'Morto'
              }
            },
            {
              property: 'Tipo',
              multi_select: {
                does_not_contain: 'Palestra'
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
        cover: r.cover?.file?.url,
        icon: r.icon?.emoji,
        properties: r.properties 
      }
    }))
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
}