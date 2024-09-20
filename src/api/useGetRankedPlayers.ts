import { useEffect } from "react";
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
  fromSeason?: string;
  toSeason?: string;
  numberOfResultsCountedToPointsTotal?: number;
};

// TODO this should return result of type RankedPlayerDTO
export const useGetRankedPlayers = ({
  category,
  division,
  numberOfResultsCountedToPointsTotal,
  fromSeason,
  toSeason,
}: UseGetRankedPlayersProps): GetRankedPlayersResult => {
  const { fetch, data, loading, error } = useFetchLazy<Array<RankedPlayerDTO>>();

  useEffect(() => {
    const seasonsArgument = fromSeason && toSeason ? { from: fromSeason, to: toSeason } : undefined;
    const queryString = createQueryString([division], seasonsArgument);

    fetch(`http:localhost:3001/rankings/${category}/players?${queryString}`);
  }, [category, division, fromSeason, toSeason, fetch]);

  return {
    data: sortPlayersByPoints(
      data,
      numberOfResultsCountedToPointsTotal ?? tournamentDrawDefaults.numberOfResultsCountedToPointsTotal
    ),
    loading,
    error,
  };
};
