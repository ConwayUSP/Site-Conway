import { useQuery } from "@tanstack/react-query";

export function useProjects() {
  const query = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      return data
    }
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching
  }
}