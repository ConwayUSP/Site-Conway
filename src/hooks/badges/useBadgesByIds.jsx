import { useQuery } from "@tanstack/react-query";
import { useBadgesMap } from "./useBadgesMap";
import { useMemo } from "react";

export function useBadgesByIds(badgesIds) {
  const { data: badgesMap } = useBadgesMap()

  const badges = useMemo(() => {
    if (!badgesMap || !badgesIds) return []

    return badgesIds.map(badge => badgesMap.get(badge.id)).filter(Boolean)
  }, [badgesMap, badgesIds])

  return { data: badges }
}