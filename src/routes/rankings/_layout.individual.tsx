import { createFileRoute } from "@tanstack/react-router";
import { IndividualRankings } from "@/components/features/Rankings/IndividualRankings";
import { RankingsFilterOptions, defaultRankingsFilterState } from "@/components/features/Rankings/settings";
import { Category, Division } from "@/domain";
import { TimePeriod } from "@/utils";

export const Route = createFileRoute("/rankings/_layout/individual")({
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
  component: IndividualRankings,
});
