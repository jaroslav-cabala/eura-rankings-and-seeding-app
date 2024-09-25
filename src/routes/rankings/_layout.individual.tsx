import { createFileRoute } from "@tanstack/react-router";
import { IndividualRankings } from "@/components/features/Rankings/IndividualRankings";
import { RankingsFilterOptions, defaultFilterForRankings } from "@/components/features/Rankings/settings";
import { Category, Division } from "@/domain";
import { TimePeriod } from "@/utils";

export const Route = createFileRoute("/rankings/_layout/individual")({
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
  component: IndividualRankings,
});
