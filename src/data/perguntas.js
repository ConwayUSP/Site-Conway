export const perguntas = [
  {
    pergunta: "Você já programou?",
    imagem: "/gifs/programming.gif",
  },
  {
    pergunta: "Quer aprender a programar?",
    imagem: "/gifs/cat-coding.gif",
  },
  {
    pergunta: "Gosta de desenhar?",
    imagem: "/gifs/drawing.gif",
  },
  {
    pergunta: "Prefere baixo nível do que alto nível?",
    imagem: "/gifs/cortisol.gif",
  },
  {
    pergunta: "Você é psicopata?",
    imagem: "/gifs/patrick.gif",
  },
  {
    pergunta: "Está na vibe de CG?",
    imagem: "/gifs/synthwave.gif",
  },
  {
    pergunta: "Você é meio idiota?",
    imagem: "/gifs/homer.gif",
  },
  {
    pergunta: "Prefere 3D do que 2D?",
    imagem: "/gifs/cube.gif",
  },
  {
    pergunta: "Prefere aprender pela prática do que pela técnica?",
    imagem: "/gifs/book.gif",
  },
];

// Escala de relevância: -6 a -1 favorece quem discorda, 0 não pontua e
// 1 a 6 favorece quem concorda. Quanto maior o módulo, maior a relevância.
// Manter a ordem abaixo sincronizada com a ordem das perguntas.
const definirPesos = ({
  experiencia = 0,
  querAprender = 0,
  desenho = 0,
  baixoNivel = 0,
  psicopata = 0,
  computacaoGrafica = 0,
  meioIdiota = 0,
  prefere3D = 0,
  pratica = 0,
}) => [
  experiencia,
  querAprender,
  desenho,
  baixoNivel,
  psicopata,
  computacaoGrafica,
  meioIdiota,
  prefere3D,
  pratica,
]

export const trilhas = [
  {
    nome: "Git & Github",
    pesos: definirPesos({
      querAprender: 2,
      psicopata: -1,
      pratica: 2,
    }),
    imagem: "/icons/trilhas/git.png",
  },
  {
    nome: "C & Raylib",
    pesos: definirPesos({
      experiencia: -2,
      querAprender: 5,
      baixoNivel: 5,
      psicopata: 3,
      computacaoGrafica: 2,
      prefere3D: -2,
      pratica: 4,
    }),
    imagem: "/icons/trilhas/c.png",
  },
  {
    nome: "Teoria da Arte",
    pesos: definirPesos({
      querAprender: -3,
      desenho: 6,
      psicopata: -2,
      computacaoGrafica: 2,
      pratica: -1,
    }),
    imagem: "/icons/trilhas/arte.png",
  },
  {
    nome: "Material Didático",
    pesos: definirPesos({
      experiencia: -5,
      querAprender: 2,
      desenho: 1,
      baixoNivel: -2,
      psicopata: -4,
      pratica: -5,
    }),
    imagem: "/icons/trilhas/material.png",
  },
  {
    nome: "OpenGL",
    pesos: definirPesos({
      experiencia: 5,
      querAprender: 2,
      desenho: 1,
      baixoNivel: 5,
      psicopata: 6,
      computacaoGrafica: 6,
      meioIdiota: 1,
      prefere3D: 5,
      pratica: -2,
    }),
    imagem: "/icons/trilhas/opengl.png",
  },
  {
    nome: "Rust & Godot",
    pesos: definirPesos({
      experiencia: 4,
      querAprender: 2,
      baixoNivel: 4,
      psicopata: 5,
      computacaoGrafica: 3,
      meioIdiota: 2,
      prefere3D: 3,
      pratica: 2,
    }),
    imagem: "/icons/trilhas/godot.png",
  },
  {
    nome: "C++",
    pesos: definirPesos({
      experiencia: 5,
      querAprender: 2,
      baixoNivel: 6,
      psicopata: 5,
      computacaoGrafica: 4,
      prefere3D: 3,
      pratica: -2,
    }),
    imagem: "/icons/trilhas/cpp.png",
  },
  {
    nome: "Jogos 3D",
    pesos: definirPesos({
      experiencia: 2,
      querAprender: 3,
      desenho: 1,
      baixoNivel: -2,
      psicopata: 2,
      computacaoGrafica: 4,
      prefere3D: 6,
      pratica: 4,
    }),
    imagem: "/icons/trilhas/3d.png",
  },
  {
    nome: "Jogos 2D",
    pesos: definirPesos({
      experiencia: -4,
      querAprender: 4,
      desenho: 2,
      baixoNivel: -3,
      psicopata: -3,
      computacaoGrafica: 2,
      prefere3D: -6,
      pratica: 6,
    }),
    imagem: "/icons/trilhas/2d.png",
  },
  {
    nome: "Lua & LÖVE",
    pesos: definirPesos({
      experiencia: -5,
      querAprender: 4,
      baixoNivel: -6,
      psicopata: -4,
      computacaoGrafica: 1,
      prefere3D: -5,
      pratica: 2,
    }),
    imagem: "/icons/trilhas/lua.png",
  },
];
