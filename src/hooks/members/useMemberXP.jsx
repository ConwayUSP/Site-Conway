export function useMemberXP(member, memberProjects) {
  // XP para passar do LVL N = 100 + (N -   1) ^ 1,33
  // XP do membro = 200PLP + 120PMP + 60PCP + 5PR + 40PP + TCvalue
  // TCvalue = 80 - i*10 se i < 5, 80 + (i - 5)*40 c.c.

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
  const TCvalue = TC > 0 ? 80 - 10 * Math.max(0, 5 - TC) + 40 * Math.max(0, TC - 5) : 0;

  const xpTotal = 200*PLP + 120*PMP + 60*PCP + 5*PR + 40*PP + TCvalue;
  const level = Math.min(8, [...Array(8).keys()].findLast(i => xpTotal >= [...Array(i).keys()].reduce((t, _, j) => t + Math.round(100 * Math.pow(1.33, j)), 0)) + 1);
  const xp = xpTotal - [...Array(level - 1).keys()].reduce((t, _, j) => t + Math.round(100 * Math.pow(1.33, j)), 0);

  return { xp, level, xpTotal };
}