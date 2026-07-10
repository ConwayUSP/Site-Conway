import { useQuery } from "@tanstack/react-query";
import { getMembers } from '@services/members';

export function useMembersMap() {
  return useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
    select: (members) => {
      return new Map(members.map(member => [member.id, member]))
    }
  })
}