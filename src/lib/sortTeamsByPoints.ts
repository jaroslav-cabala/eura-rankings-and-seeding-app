import { RankedTeamDTO } from "@/api/apiTypes";
import { RankedTeam } from "@/domain";
import { getTotalPointsFromXBestResults } from "./getTotalPointsFromXBestResults";

export const sortTeamsByPoints = (
  data: Array<RankedTeamDTO> | undefined,
  numberOfResultsCountedToPointsTotal: number
): Array<RankedTeam> =>
  data
    ?.map<RankedTeam>((team) => ({
      ...team,
      points: getTotalPointsFromXBestResults(team.tournamentResults, numberOfResultsCountedToPointsTotal),
    }))
    .sort((teamA, teamB) => teamB.points - teamA.points) ?? [];
