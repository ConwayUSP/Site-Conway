import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getProject } from "@services/projects";

export function useProject(id) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    initialData: () => {
      return queryClient.getQueryData(['projects'])?.find(project => project.id === id)
    },
    staleTime: Infinity,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching
  }
}
