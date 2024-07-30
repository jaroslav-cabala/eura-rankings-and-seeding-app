import { TeamRankings } from "@/components/features/Rankings/TeamRankings";
import { RankingsFilterOptions, defaultRankingsFilterState } from "@/components/features/Rankings/settings";
import { Category, Division } from "@/domain";
import { TimePeriod } from "@/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rankings/_layout/team")({
  validateSearch: (search: Record<string, unknown>): RankingsFilterOptions => {
    return {
      category: (search?.category as Category) || defaultRankingsFilterState.category,
      division: (search?.division as Division) || defaultRankingsFilterState.division,
      numberOfResultsCountedToPointsTotal:
        (search?.numberOfResultsCountedToPointsTotal as number) ||
        defaultRankingsFilterState.numberOfResultsCountedToPointsTotal,
      search: (search?.search as string) ?? defaultRankingsFilterState.search,
      seasons: (search?.seasons as TimePeriod) || defaultRankingsFilterState.seasons,
    };
  },
  component: TeamRankings,
});
