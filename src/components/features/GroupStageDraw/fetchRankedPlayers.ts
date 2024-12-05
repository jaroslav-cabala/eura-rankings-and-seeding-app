import { RankedPlayerDTO, PlayersFilterDTO, TournamentResultsFilterDTO } from "@/api/apiTypes";
import {
  createRankedPlayersFilterQueryString,
  createTournamentResultsFilterQueryString,
} from "@/api/queryStringCreators";

// TODO error handling
export const fetchRankedPlayers = async (filter?: PlayersFilterDTO): Promise<Array<RankedPlayerDTO>> => {
  const {
    playerCategory,
    resultCategories,
    resultDivisions,
    seasons,
    includeEntitiesWithNoTournamentResults,
  } = filter ?? {};

  const queryString = createRankedPlayersFilterQueryString({
    includeEntitiesWithNoTournamentResults,
    playerCategory,
    resultCategories,
    resultDivisions,
    seasons,
  });
  const fetchResultPlayers = await fetch(new URL(`http:localhost:3001/rankings/players?${queryString}`));

  return fetchResultPlayers.json();
};

export const fetchRankedPlayer = async ({
  uid,
  resultCategories,
  resultDivisions,
  seasons,
}: TournamentResultsFilterDTO & { uid: string }): Promise<RankedPlayerDTO> => {
  const queryString = createTournamentResultsFilterQueryString({
    resultCategories,
    resultDivisions,
    seasons,
  });

  const fetchResultPlayer = await fetch(
    new URL(`http:localhost:3001/rankings/players/${uid}?${queryString}`)
  );

  return fetchResultPlayer.json();
};
