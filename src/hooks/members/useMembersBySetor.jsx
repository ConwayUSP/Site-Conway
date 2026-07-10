import { useMemo } from "react";

export function useMembersBySetor(members, setor) {
  const filteredMembers = useMemo(() => {
    if (!setor || setor === "Todos")
      return members

    return members.filter(m => m?.properties?.['Setor']?.multi_select?.some(s => s.name.slice(-5).trim().slice(1, -1) == setor))
  }, [members, setor])

  return filteredMembers

}