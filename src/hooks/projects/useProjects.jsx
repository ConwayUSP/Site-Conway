import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@services/projects";

export function useProjects() {
  const query = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching
  }
}