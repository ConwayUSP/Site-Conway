export function useMemberXP(member, memberProjects) {
  const level = 0;
  
  // XP para passar do LVL N = 100 + (N - 1) * 25
  // XP do membro = 200PLP + 120PMP + 50PCP + 5PR + 20PP + 40TC

  // PLP, PMP e PCP: projetos de longo, médio e curto prazo concluídos
  // PR: presenças em reuniões
  // PP: projetos propostos (ou aprovados por OP?)
  // TC: trilhas concluídas (selos adquiridos) 

  const PLP = memberProjects?.filter(project => project.properties?.["Duração"]?.multi_select[0].name === "Longo Prazo").length || [];
  const PMP = memberProjects?.filter(project => project.properties?.["Duração"]?.multi_select[0].name === "Médio Prazo").length || [];
  const PCP = memberProjects?.filter(project => project.properties?.["Duração"]?.multi_select[0].name === "Curto Prazo").length || [];
  const PP = member?.properties?.["Forms submetidos"]?.relation.length || 0;
  const PR = member?.properties?.["Reuniões"]?.relation.length || 0;
  const TC = member?.properties?.["Selos"]?.relation.length || 0;

  const xp = 200*PLP + 120*PMP + 50*PCP + 5*PR + 20*PP + 40*TC;

  return { xp, level};
}