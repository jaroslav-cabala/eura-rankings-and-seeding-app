import { RankedPlayerDTO } from "@/api/apiTypes";
import { createQueryString } from "@/api/createQueryStringsContainingFilters";
import { Division, Category } from "@/domain";

export const fetchAllRankedPlayers = async (
  category: Category,
  divisions: Array<Division>
): Promise<Array<RankedPlayerDTO>> => {
  const queryStringPlayers = createQueryString(divisions);
  const fetchResultPlayers = await fetch(
    new URL(`http:localhost:3001/rankings/${category}/players?${queryStringPlayers}`)
  );

  return fetchResultPlayers.json();
};

export const fetchRankedPlayer = async (playerId: string, category: Category): Promise<RankedPlayerDTO> => {
  const fetchResultPlayer = await fetch(
    new URL(`http:localhost:3001/rankings/${category}/players/${playerId}`)
  );

  return fetchResultPlayer.json();
};
