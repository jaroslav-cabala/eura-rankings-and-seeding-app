import { useState } from "react";
import { Category, Division, RankedEntity } from "@/domain";
import { TimePeriod } from "@/utils";

export type RankingsState = {
  // rankedEntity: RankedEntity;
  category: Category;
  division: Division;
  seasons: TimePeriod;
  numberOfResultsCountedToPointsTotal: number;
  search: string;
};

export type UseRankingsState = {
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

export const useRankingsState = (): UseRankingsState => {
  console.log("UseRankingsState hook");
  // const [rankedEntity, setRankedEntity] = useState<RankedEntity>(defaultRankingsState.rankedEntity);
  const [category, setCategory] = useState<Category>(defaultRankingsState.category);
  const [division, setDivision] = useState<Division>(defaultRankingsState.division);
  const [seasons, setSeasons] = useState<TimePeriod>(defaultRankingsState.seasons);
  const [numberOfResultsCountedToPointsTotal, setNumberOfResultsCountedToPointsTotal] = useState<number>(
    defaultRankingsState.numberOfResultsCountedToPointsTotal
  );
  const [search, setSearch] = useState<string>(defaultRankingsState.search);

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

const defaultRankingsState: RankingsState = {
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
