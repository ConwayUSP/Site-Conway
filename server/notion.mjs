const NOTION_API_URL = 'https://api.notion.com/v1'

const memberPropertyIds = [
  'title', // Nome
  'APEF', // Fotinha
  'VNFK', // Fotinha otimizada
  'NMrA', // Setor
  'h%5BeT', // Status
  'X%3FwO', // Projetos
  'bsCv', // Selos
  'buW%60', // Frase do Dia
  '~%3FS%3B', // Forms submetidos
  'bEuw', // Reuniões
]

const projectPropertyIds = [
  'title', // Nome do Projeto
  'V_xq', // Status
  'OxxL', // Duração
  '%3Fu%3C_', // Descrição
  'av_~', // Tipo
  'g%5DC%3A', // Líder do Projeto
  'qmf%3D', // Acompanhantes
  'aPE%5E', // Envolvidos
  'amIf', // Imagens
  'J%3A~a', // Repositório
  '%5C%3A%40c', // Link interativo
]

export const notionPropertyIds = {
  members: memberPropertyIds,
  projects: projectPropertyIds,
  badges: ['title'], // Name
}

function buildNotionUrl(path, propertyIds) {
  const url = new URL(`${NOTION_API_URL}/${path}`)

  propertyIds.forEach(propertyId => {
    url.searchParams.append('filter_properties', decodeURIComponent(propertyId))
  })

  return url
}

export function fetchNotion(path, { propertyIds = [], headers = {}, ...options } = {}) {
  return fetch(buildNotionUrl(path, propertyIds), {
    ...options,
    headers: {
      'Notion-Version': '2026-03-11',
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}
