<h1> 
    <img src="./public/icons/logos/white.svg" style="height: 1.25rem" alt="logo"/>
    Site da Conway
</h1>
Em breve...

## Executando o projeto localmente
Para rodar o projeto localmente, certifique-se de ter o **Node.js** e o Yarn instalados. Siga os seguintes passos:
- Execute `npm install` para instalar as dependências;
- Execute `npm run dev` para iniciar a aplicação no **localhost:5173**.

## Estrutura do projeto:
Este projeto foi desenvolvido com **Vite (React)**. Abaixo está a estrutura das pastas principais dentro de `/src`: 

1. `/assets`: conjunto de imagens, ícones e afins;
2. `/components`: componentes reutilizáveis do site; 
3. `/pages`: definições de serviços que podem ser chamados nas páginas;
4. `/utils`: funções que podem ser reutilizadas pelos componentes e páginas.

## Otimização das fotos dos membros

O script `scripts/optimize_member_photos.py` analisa as fotos originais do
Notion, gera versões WebP de no máximo 1600x1600 e 500 KB quando necessário e
usa o campo `Fotinha hash` para não repetir trabalho. O campo `Fotinha` nunca é
alterado; a versão gerada é salva em `Fotinha otimizada`.

Instale as dependências:

```powershell
python -m pip install -r scripts/requirements.txt
```

Simule a execução primeiro (este é o modo padrão):

```powershell
python scripts/optimize_member_photos.py
```

Depois de conferir o resumo, aplique as alterações:

```powershell
python scripts/optimize_member_photos.py --apply
```

O script lê `NOTION_TOKEN` do ambiente ou do arquivo `.env.local`. Os nomes dos
campos não diferenciam maiúsculas de minúsculas e podem ser sobrescritos com
`--source-property`, `--output-property` e `--hash-property`.

### Execução pelo GitHub Actions

Cadastre `NOTION_TOKEN` em **Settings > Secrets and variables > Actions** no
GitHub. Depois que o workflow estiver na branch principal, acesse **Actions >
Otimizar fotos dos membros > Run workflow**. Deixe `Aplicar alterações no
Notion` desmarcado para simular ou marque-o para efetivar os uploads.

<br/><br/><br/>
<img src="./public/readme-footer.webp" alt="footer" />
