import { useState } from "react";
import { Category, Division } from "@/domain";
import { TimePeriod } from "@/utils";
import { RankingsFilterOptions } from "./settings";

export type UseRankingsFilterState = {
  // rankedEntity: RankedEntity;
  category: Category;
  division: Division;
  seasons: TimePeriod;
  numberOfResultsCountedToPointsTotal: number;
  search: string;
  // setRankedEntity: React.Dispatch<React.SetStateAction<RankedEntity>>;
  setCategory: React.Dispatch<React.SetStateAction<Category>>;
  setDivision: React.Dispatch<React.SetStateAction<Division>>;
  setSeasons: React.Dispatch<React.SetStateAction<TimePeriod>>;
  setNumberOfResultsCountedToPointsTotal: React.Dispatch<React.SetStateAction<number>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export const useRankingsFilterState = (filterValues: RankingsFilterOptions): UseRankingsFilterState => {
  console.log("UseRankingsState hook");
  // const [rankedEntity, setRankedEntity] = useState<RankedEntity>(defaultRankingsState.rankedEntity);
  const [category, setCategory] = useState<Category>(filterValues.category);
  const [division, setDivision] = useState<Division>(filterValues.division);
  const [seasons, setSeasons] = useState<TimePeriod>(filterValues.seasons);
  const [numberOfResultsCountedToPointsTotal, setNumberOfResultsCountedToPointsTotal] = useState<number>(
    filterValues.numberOfResultsCountedToPointsTotal
  );
  const [search, setSearch] = useState<string>(filterValues.search);

  return {
    // rankedEntity,
    category,
    division,
    seasons,
    numberOfResultsCountedToPointsTotal,
    search,
    // setRankedEntity,
    setCategory,
    setDivision,
    setSeasons,
    setNumberOfResultsCountedToPointsTotal,
    setSearch,
  };
};
