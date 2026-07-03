import { useQuery } from "@tanstack/react-query";
import { useProjectsMap } from "./useProjectsMap";
import { useMemo } from "react";

export function useProjectsByIds(projectIds) {
  const { data: projectsMap } = useProjectsMap()

  const projects = useMemo(() => {
    if (!projectsMap || !projectIds) return []

    return projectIds.map(project => projectsMap.get(project.id)).filter(Boolean)
  }, [projectsMap, projectIds])

  return { data: projects }
}