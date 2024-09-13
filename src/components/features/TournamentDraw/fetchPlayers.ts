import { RankedPlayerDTO } from "@/api/apiTypes";
import { createQueryString } from "@/api/createQueryStringsContainingFilters";
import { Division, Category } from "@/domain";

export const fetchPlayers = async (): Promise<Array<RankedPlayerDTO>> => {
  const queryStringPlayers = createQueryString(Division.Pro, { from: "2024", to: "2024" });
  const fetchResultPlayers = await fetch(
    new URL(`http:localhost:3001/rankings/${Category.Open}/players?${queryStringPlayers}`)
  );

  return fetchResultPlayers.json();
};
