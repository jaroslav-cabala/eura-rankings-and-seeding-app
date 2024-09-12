import { useEffect } from "react";
import { Category, Division, RankedTeam } from "../domain";
import { useFetchLazy } from "./useFetch";
import { RankedTeamDTO } from "./apiTypes";
import { TimePeriod } from "@/utils";
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
  seasons: TimePeriod;
  numberOfResultsCountedToPointsTotal: number;
};

export const useGetRankedTeams = ({
  category,
  division,
  numberOfResultsCountedToPointsTotal,
  seasons,
}: UseGetRankedTeamsProps): GetRankedTeamsResult => {
  console.log(`useGetRankedTeams hook, category=${category},division=${division},
    numberOfResultsCountedToPointsTotal=${numberOfResultsCountedToPointsTotal},
    seasons={from=${seasons.from},to=${seasons.to}}`);
  const { fetch, data, loading, error } = useFetchLazy<Array<RankedTeamDTO>>();

  useEffect(() => {
    const queryString = createQueryString(division, seasons);
    fetch(`http:localhost:3001/rankings/${category}/teams?${queryString}`);
  }, [category, division, seasons, fetch]);

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
