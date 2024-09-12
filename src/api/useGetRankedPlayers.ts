import { useEffect } from "react";
import { TimePeriod } from "@/utils";
import { RankedPlayerDTO } from "./apiTypes";
import { Category, Division, RankedPlayer } from "../domain";
import { useFetchLazy } from "./useFetch";
import { createQueryString } from "./createQueryStringsContainingFilters";
import { tournamentDrawDefaults } from "@/config";
import { sortPlayersByPoints } from "@/lib/sortPlayersByPoints";

export type GetRankedPlayersResult = {
  data: Array<RankedPlayer>;
  loading: boolean;
  error: boolean;
};

type UseGetRankedPlayersProps = {
  category: Category;
  division: Division;
  seasons: TimePeriod;
  numberOfResultsCountedToPointsTotal?: number;
};

export const useGetRankedPlayers = ({
  category,
  division,
  numberOfResultsCountedToPointsTotal,
  seasons,
}: UseGetRankedPlayersProps): GetRankedPlayersResult => {
  console.log(`useGetRankedPlayers hook, category=${category},division=${division},
    numberOfResultsCountedToPointsTotal=${numberOfResultsCountedToPointsTotal},
    seasons={from=${seasons.from},to=${seasons.to}}`);

  const { fetch, data, loading, error } = useFetchLazy<Array<RankedPlayerDTO>>();

  useEffect(() => {
    const queryString = createQueryString(division, seasons);
    fetch(`http:localhost:3001/rankings/${category}/players?${queryString}`);
  }, [category, division, seasons, fetch]);

  return {
    data: sortPlayersByPoints(
      data,
      numberOfResultsCountedToPointsTotal ?? tournamentDrawDefaults.numberOfResultsCountedToPointsTotal
    ),
    loading,
    error,
  };
};
