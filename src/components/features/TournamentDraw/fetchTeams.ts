import { RankedTeamDTO } from "@/api/apiTypes";
import { createQueryString } from "@/api/createQueryStringsContainingFilters";
import { Division, Category } from "@/domain";

export const fetchTeams = async (): Promise<Array<RankedTeamDTO>> => {
  const queryStringTeams = createQueryString(Division.Pro, { from: "2024", to: "2024" });
  const fetchResultTeams = await fetch(
    new URL(`http:localhost:3001/rankings/${Category.Open}/teams?${queryStringTeams}`)
  );

  return fetchResultTeams.json();
};
