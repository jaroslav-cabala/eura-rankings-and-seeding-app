import { RankedTeamDTO } from "@/api/apiTypes";
import { createQueryString } from "@/api/createQueryStringsContainingFilters";
import { Division, Category } from "@/domain";

export const fetchRankedTeams = async (category: Category): Promise<Array<RankedTeamDTO>> => {
  const queryStringTeams = createQueryString(Division.Pro);
  const fetchResultTeams = await fetch(
    new URL(`http:localhost:3001/rankings/${category}/teams?${queryStringTeams}`)
  );

  return fetchResultTeams.json();
};
