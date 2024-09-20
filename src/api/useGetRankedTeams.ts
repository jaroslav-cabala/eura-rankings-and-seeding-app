import { useEffect } from "react";
import { Category, Division, RankedTeam } from "../domain";
import { useFetchLazy } from "./useFetch";
import { RankedTeamDTO } from "./apiTypes";
import { createQueryString } from "./createQueryStringsContainingFilters";
import { tournamentDrawDefaults } from "@/config";
import { sortTeamsByPoints } from "@/lib/sortTeamsByPoints";

export type GetRankedTeamsResult = {
  data: Array<RankedTeam>;
  loading: boolean;
  error: boolean;
};

type UseGetRankedTeamsProps = {
  category: Category;
  division: Division;
  fromSeason?: string;
  toSeason?: string;
  numberOfResultsCountedToPointsTotal: number;
};

export const useGetRankedTeams = ({
  category,
  division,
  numberOfResultsCountedToPointsTotal,
  fromSeason,
  toSeason,
}: UseGetRankedTeamsProps): GetRankedTeamsResult => {
  const { fetch, data, loading, error } = useFetchLazy<Array<RankedTeamDTO>>();

  useEffect(() => {
    const seasonsArgument = fromSeason && toSeason ? { from: fromSeason, to: toSeason } : undefined;
    const queryString = createQueryString([division], seasonsArgument);

    fetch(`http:localhost:3001/rankings/${category}/teams?${queryString}`);
  }, [category, division, fetch, fromSeason, toSeason]);

  return {
    data: sortTeamsByPoints(data, numberOfResultsCountedToPointsTotal),
    loading,
    error,
  };
};

export type GetRankedTeamsLazyResult = {
  fetch: (url: string, requestInit?: RequestInit) => Promise<void>;
  data: Array<RankedTeam>;
  loading: boolean;
  error: boolean;
};

// TODO: decide whether this function is needed
export const useGetRankedTeamsLazy = (
  numberOfResultsCountedToPointsTotal?: number
): GetRankedTeamsLazyResult => {
  console.log(`useGetRankedPlayersLazy hook,
    numberOfResultsCountedToPointsTotal=${numberOfResultsCountedToPointsTotal}`);

  const { fetch, data, loading, error } = useFetchLazy<Array<RankedTeamDTO>>();

  return {
    fetch,
    data: sortTeamsByPoints(
      data,
      numberOfResultsCountedToPointsTotal ?? tournamentDrawDefaults.numberOfResultsCountedToPointsTotal
    ),
    loading,
    error,
  };
};
