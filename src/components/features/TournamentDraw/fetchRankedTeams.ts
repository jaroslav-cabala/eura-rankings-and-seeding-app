import { RankedTeamDTO } from "@/api/apiTypes";
import { createQueryString } from "@/api/createQueryStringsContainingFilters";
import { Division, Category } from "@/domain";

export const fetchRankedTeams = async (
  category: Category,
  divisions: Array<Division>
): Promise<Array<RankedTeamDTO>> => {
  const queryStringTeams = createQueryString(divisions);
  const fetchResultTeams = await fetch(
    new URL(`http:localhost:3001/rankings/${category}/teams?${queryStringTeams}`)
  );

  return fetchResultTeams.json();
};
