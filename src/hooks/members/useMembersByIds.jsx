import { useQuery } from "@tanstack/react-query";
import { useMembersMap } from "./useMembersMap";
import { useMemo } from "react";

export function useMembersByIds(memberIds) {
  const { data: membersMap } = useMembersMap()

  const members = useMemo(() => {
    if (!membersMap || !memberIds) return []

    return memberIds.map(member=> membersMap.get(member.id)).filter(Boolean)
  }, [membersMap, memberIds])

  return { data: members }
}