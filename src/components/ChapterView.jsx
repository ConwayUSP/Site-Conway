import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// essa é a visualização de um capítulo específico,
// recebe como argumentos o URL base do repo e o caminho pro .md
export function ChapterView({ repoRootUrl, filepath }) {
  const [content, setContent] = useState('Carregando conteúdo...');
  const mdAbsoluteUrl = new URL(filepath, repoRootUrl).href;

  useEffect(() => {
    fetch(mdAbsoluteUrl)
      .then(res => {
        if (!res.ok) throw new Error("Erro");
        return res.text();
      })
      .then(text => setContent(text))
      .catch(err => setContent("# Erro\nNão foi possível carregar."));
  }, [mdAbsoluteUrl]);

  return (
    <div className="markdown-container">
      <ReactMarkdown
        components={{
          // intercepta imagens para substituir o caminho relativo por um absoluto
          img: ({ node, src, alt, ...props }) => {
            const isAbsolute = src.startsWith('http://') || src.startsWith('https://');
            const resolvedSrc = isAbsolute ? src : new URL(src, mdAbsoluteUrl).href;
            return <img src={resolvedSrc} alt={alt || 'Imagem'} style={{ maxWidth: '100%' }} {...props} />;
          },
          
          // intercepta blocos de código para usarmos o SyntaxHighlighter
          code({ node, inline, className, children, ...props }) {
            // verifica se o markdown especificou uma linguagem
            const match = /language-(\w+)/.exec(className || '');
            // extrai a linguagem e converte para minúsculo
            let lang = match ? match[1].toLowerCase() : '';
            if (lang === 'c++') lang = 'cpp';
                      
            // estado local para o botão de copiar ("Copiar" -> "Copiado!")
            const [isCopied, setIsCopied] = useState(false);

            const handleCopy = () => {
              // copia o texto para a área de transferência do usuário
              navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            };

            return !inline && match ? (
              <div className="code-block-wrapper">
                {/* o cabeçalho da caixinha (linguagem + botão copiar) */}
                <div className="code-block-header">
                  <span>{match[1]}</span>
                  <button onClick={handleCopy} className={isCopied ? 'copied' : ''}>
                    {isCopied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                
                {/* o renderizador de código em si */}
                <SyntaxHighlighter
                  {...props}
                  style={{}}
                  children={String(children).replace(/\n$/, '')}
                  language={lang}
                  useInlineStyles={false}
                  PreTag="div"
                  className="code-block-content"
                />
              </div>
            ) : (
              // se for só código inline (`codigo`), renderiza normal
              <code className={`inline-code ${className || ''}`} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
