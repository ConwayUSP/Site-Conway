import { getBadges } from "@services/badges";
import { useQuery } from "@tanstack/react-query";

export function useBadgesMap() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: getBadges,
    select: (badges) => {
      return new Map(badges.map(badge => [badge.id, badge]))
    }
  })
}