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
  setCategory: (value: Category) => void;
  setDivision: (value: Division) => void;
  setSeasons: (value: TimePeriod) => void;
  setNumberOfResultsCountedToPointsTotal: (value: number) => void;
  setSearch: (value: string) => void;
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

  const setPropertyAndUpdateSearchParams = <T,>(
    searchParamName: string,
    value: T,
    setStateAction: React.Dispatch<React.SetStateAction<T>>
  ) => {
    updateSearchParams(searchParamName, value as string);
    setStateAction(value);
  };

  return {
    // rankedEntity,
    category,
    division,
    seasons,
    numberOfResultsCountedToPointsTotal,
    search,
    // setRankedEntity,
    setCategory: (value: Category) => setPropertyAndUpdateSearchParams("category", value, setCategory),
    setDivision: (value: Division) => setPropertyAndUpdateSearchParams("division", value, setDivision),
    setSeasons: (value: TimePeriod) => setPropertyAndUpdateSearchParams("seasons", value, setSeasons),
    setNumberOfResultsCountedToPointsTotal: (value: number) =>
      setPropertyAndUpdateSearchParams(
        "numberOfResultsCountedToPointsTotal",
        value,
        setNumberOfResultsCountedToPointsTotal
      ),
    setSearch: (value: string) => setPropertyAndUpdateSearchParams("search", value, setSearch),
  };
};

const updateSearchParams = (searchParamName: string, searchParamValue: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set(searchParamName, encodeURI(searchParamValue));
  history.pushState({}, "", url);
};
