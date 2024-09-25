import { RankedTeamDTO, RankedTeamsFilter } from "@/api/apiTypes";
import { createRankedTeamsFilterQueryString } from "@/api/queryStringCreators";

// TODO error handling
export const fetchRankedTeams = async (filter?: RankedTeamsFilter): Promise<Array<RankedTeamDTO>> => {
  const { teamCategory, resultCategories, resultDivisions, seasons, includeEntitiesWithNoTournamentResults } =
    filter ?? {};

  const queryString = createRankedTeamsFilterQueryString({
    includeEntitiesWithNoTournamentResults,
    teamCategory,
    resultCategories,
    resultDivisions,
    seasons,
  });

  const fetchResultTeams = await fetch(new URL(`http:localhost:3001/rankings/teams?${queryString}`));

  return fetchResultTeams.json();
};
