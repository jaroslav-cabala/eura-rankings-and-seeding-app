import { TeamRankings } from "@/components/features/Rankings/TeamRankings";
import { RankingsFilterOptions, defaultFilterForRankings } from "@/components/features/Rankings/settings";
import { Category, Division } from "@/domain";
import { TimePeriod } from "@/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rankings/_layout/team")({
  validateSearch: (search: Record<string, unknown>): RankingsFilterOptions => {
    return {
      category: (search?.category as Category) || defaultFilterForRankings.category,
      division: (search?.division as Division) || defaultFilterForRankings.division,
      numberOfResultsCountedToPointsTotal:
        (search?.numberOfResultsCountedToPointsTotal as number) ||
        defaultFilterForRankings.numberOfResultsCountedToPointsTotal,
      search: (search?.search as string) ?? defaultFilterForRankings.search,
      seasons: (search?.seasons as TimePeriod) || defaultFilterForRankings.seasons,
    };
  },
  component: TeamRankings,
});
