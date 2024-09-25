import { useEffect } from "react";
import { useFetchLazy } from "./useFetch";
import { RankedTeamDTO, RankedTeamsFilter } from "./apiTypes";
import { createRankedTeamsFilterQueryString } from "./queryStringCreators";

export type GetRankedTeamsResult = {
  data: Array<RankedTeamDTO>;
  loading: boolean;
  error: boolean;
};

// Fetched ranked entities from the backend. By default, entities that have no tournament results will not be
// included in the result.
export const useGetRankedTeams = (filter?: RankedTeamsFilter): GetRankedTeamsResult => {
  const { teamCategory, resultCategories, resultDivisions, seasons, includeEntitiesWithNoTournamentResults } =
    filter ?? {};

  const { fetch, data, loading, error } = useFetchLazy<Array<RankedTeamDTO>>();

  const queryString = createRankedTeamsFilterQueryString({
    includeEntitiesWithNoTournamentResults,
    teamCategory,
    resultCategories,
    resultDivisions,
    seasons,
  });

  useEffect(() => {
    fetch(`http:localhost:3001/rankings/teams?${queryString}`);
  }, [fetch, queryString]);

  return {
    data: data ?? [],
    loading,
    error,
  };
};

export type GetRankedTeamsLazyResult = {
  fetch: (url: string, requestInit?: RequestInit) => Promise<void>;
  data: Array<RankedTeamDTO>;
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
    data: data ?? [],
    loading,
    error,
  };
};
