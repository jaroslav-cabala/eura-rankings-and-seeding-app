import { useEffect } from "react";
import { useFetchLazy } from "./useFetch";
import { RankedTeamDTO, TeamsFilterDTO } from "./apiTypes";
import { createRankedTeamsFilterQueryString } from "./queryStringCreators";

export type GetRankedTeamsResult = {
  data: Array<RankedTeamDTO>;
  loading: boolean;
  error: boolean;
  completed: boolean;
};

// Fetched ranked entities from the backend. By default, entities that have no tournament results will not be
// included in the result.
export const useGetRankedTeams = (filter?: TeamsFilterDTO): GetRankedTeamsResult => {
  const { teamCategory, resultCategories, resultDivisions, seasons, includeEntitiesWithNoTournamentResults } =
    filter ?? {};

  const { fetch, data, loading, error, completed } = useFetchLazy<Array<RankedTeamDTO>>();

  const queryString = createRankedTeamsFilterQueryString({
    includeEntitiesWithNoTournamentResults,
    teamCategory,
    resultCategories,
    resultDivisions,
    seasons,
  });

  useEffect(() => {
    fetch({ fetchUrl: `http:localhost:3001/rankings/teams?${queryString}` });
  }, [fetch, queryString]);

  return {
    data: data ?? [],
    loading,
    error,
    completed,
  };
};

export type GetRankedTeamsLazyResult = {
  fetch: (url: string, requestInit?: RequestInit) => Promise<void>;
  data: Array<RankedTeamDTO>;
  loading: boolean;
  error: boolean;
  completed: boolean;
};

// TODO: decide whether this function is needed
// export const useGetRankedTeamsLazy = (
//   numberOfResultsCountedToPointsTotal?: number
// ): GetRankedTeamsLazyResult => {
//   console.log(`useGetRankedPlayersLazy hook,
//     numberOfResultsCountedToPointsTotal=${numberOfResultsCountedToPointsTotal}`);

//   const { fetch, data, loading, error, completed } = useFetchLazy<Array<RankedTeamDTO>>();

//   return {
//     fetch,
//     data: data ?? [],
//     loading,
//     error,
//     completed,
//   };
// };
