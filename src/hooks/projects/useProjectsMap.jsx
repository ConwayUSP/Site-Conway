import { getProjects } from "@services/projects";
import { useQuery } from "@tanstack/react-query";

export function useProjectsMap() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    select: (projects) => {
      return new Map(projects.map(project => [project.id, project]))
    }
  })
}