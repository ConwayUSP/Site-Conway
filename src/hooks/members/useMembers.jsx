import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@services/members";

export function useMembers() {
  const query = useQuery({
    queryKey: ['members'],
    queryFn: getMembers
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching
  }
}