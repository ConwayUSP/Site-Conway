import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getMember } from "@services/members";

export function useMember(id) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['member', id],
    queryFn: () => getMember(id),
    initialData: () => {
      return queryClient.getQueryData(['members'])?.find(m => m.id == id)
    }
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching
  }
}