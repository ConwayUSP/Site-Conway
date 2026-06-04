import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// essa é a visualização de um capítulo específico,
// recebe como argumentos o URL base do repo e o caminho pro .md
export function ChapterView({ repoRootUrl, filepath }) {
  const [content, setContent] = useState('Buscando capítulo...');
  const mdAbsoluteUrl = new URL(filepath, repoRootUrl).href;

  useEffect(() => {
    // busca o arquivo de texto cru no Github toda vez que a rota/arquivo mudar
    fetch(mdAbsoluteUrl)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar o arquivo");
        return res.text();
      })
      .then(text => setContent(text))
      .catch(err => setContent("# Erro\nNão foi possível carregar este capítulo."));
  }, [mdAbsoluteUrl]);

  return (
    <div className="markdown-container">
      <ReactMarkdown
        components={{
          // intercepta todas as tags <img> do Markdown
          img: ({ node, src, alt, ...props }) => {
            // se o link for absoluto, mantém. Se não, resolve com base no arquivo MD atual.
            const isAbsolute = src.startsWith('http://') || src.startsWith('https://');
            const resolvedSrc = isAbsolute ? src : new URL(src, mdAbsoluteUrl).href;
            
            return <img src={resolvedSrc} alt={alt || 'sem alt'} style={{ maxWidth: '100%' }} {...props} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
