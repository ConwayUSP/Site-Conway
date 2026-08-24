export const compability = (trilhas, points) => {
  return trilhas
    .map((trilha) => ({
      nome: trilha.nome,
      imagem: trilha.imagem,
      pontos: trilha.pesos.reduce(
        (total, peso, i) => total + peso * (points[i] ?? 0),
        0
      ),
    }))
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 3);
};