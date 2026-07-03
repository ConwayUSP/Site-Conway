export default async function handler(req, res) {
  try {
    const { id } = req.query
    const resp = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: 'GET',
      headers: {
        'Notion-Version': '2026-03-11',
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        "Content-Type": "application/json"
      },
    })

    
    const data = await resp.json()
    console.log(data.icon)
    
    res.status(200).json({
      id: data.id,
      icon: data.icon?.emoji,
      properties: data.properties 
    })
  } catch (error) {
    console.error('Error fetching member:', error)
    res.status(500).json({ error: 'Failed to fetch member' })
  }
}