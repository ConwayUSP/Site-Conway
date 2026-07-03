import { useQuery } from "@tanstack/react-query";

export function useMembers() {
  const query = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await fetch('/api/members')
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