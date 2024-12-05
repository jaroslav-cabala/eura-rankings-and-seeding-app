import { useEffect } from "react";
import { RankedPlayerDTO, PlayersFilterDTO } from "./apiTypes";
import { useFetchLazy } from "./useFetch";
import { createRankedPlayersFilterQueryString } from "./queryStringCreators";

export type GetRankedPlayersResult = {
  data: Array<RankedPlayerDTO>;
  loading: boolean;
  error: boolean;
  completed: boolean;
};

// Fetched ranked entities from the backend. By default, entities that have no tournament results will not be
// included in the result.
export const useGetRankedPlayers = (filter?: PlayersFilterDTO): GetRankedPlayersResult => {
  const {
    playerCategory,
    resultCategories,
    resultDivisions,
    seasons,
    includeEntitiesWithNoTournamentResults,
  } = filter ?? {};

  const { fetch, data, loading, error, completed } = useFetchLazy<Array<RankedPlayerDTO>>();

  const queryString = createRankedPlayersFilterQueryString({
    includeEntitiesWithNoTournamentResults,
    playerCategory,
    resultCategories,
    resultDivisions,
    seasons,
  });

  useEffect(() => {
    fetch({ fetchUrl: `http:localhost:3001/rankings/players?${queryString}` });
  }, [fetch, queryString]);

  return {
    data: data ?? [],
    loading,
    error,
    completed,
  };
};
