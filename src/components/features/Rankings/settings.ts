import { Category, Division } from "@/domain";
import { TimePeriod, getCurrentYear } from "@/utils";

export type RankingsFilterOptions = {
  // rankedEntity: RankedEntity;
  category: Category;
  division: Division;
  seasons: TimePeriod;
  numberOfResultsCountedToPointsTotal: number;
  search: string;
};

export const defaultRankingsFilterState: RankingsFilterOptions = {
  // rankedEntity: RankedEntity.Individual,
  category: Category.Open,
  division: Division.Pro,
  seasons: {
    from: "2024",
    to: "2024",
  },
  numberOfResultsCountedToPointsTotal: 3,
  search: "",
};

export const timePeriodStartYear = 2023;
export const timePeriodOptions = Array(getCurrentYear - timePeriodStartYear + 1)
  .fill(0)
  .map((_, index) => timePeriodStartYear + index);
