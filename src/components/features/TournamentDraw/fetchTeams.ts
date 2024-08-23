import { Player, RankedTeam, RankedTeamTournamentResult } from "@/api/apiTypes";
import { createQueryString } from "@/api/createQueryStringsContainingFilters";
import { tournamentDrawDefaults } from "@/config";
import { Division, Category } from "@/domain";
import { getTotalPointsFromXBestResults } from "@/lib/getTotalPointsFromXBestResults";

export type RankedTeams = Array<{
  teamId: string;
  teamUid: string;
  name: string;
  playerOne: Player;
  playerTwo: Player;
  points: number;
  tournamentResults: Array<RankedTeamTournamentResult>;
}>;

export const fetchTeams = async (): Promise<RankedTeams> => {
  const queryStringTeams = createQueryString(Division.Pro, { from: "2024", to: "2024" });
  const fetchResultTeams = await fetch(
    new URL(`http:localhost:3001/rankings/${Category.Open}/teams?${queryStringTeams}`)
  );
  const rankedTeams: Array<RankedTeam> = await fetchResultTeams.json();
  return sortTeams(rankedTeams, tournamentDrawDefaults.numberOfResultsCountedToPointsTotal);
};

const sortTeams = (
  data: Array<RankedTeam> | undefined,
  numberOfResultsCountedToPointsTotal: number
): RankedTeams =>
  data
    ?.map<RankedTeams[number]>((team) => ({
      teamId: team.id,
      teamUid: team.uid,
      name: team.name,
      playerOne: team.players[0],
      playerTwo: team.players[1],
      points: getTotalPointsFromXBestResults(team.tournamentResults, numberOfResultsCountedToPointsTotal),
      tournamentResults: team.tournamentResults,
    }))
    .sort((teamA, teamB) => teamB.points - teamA.points) ?? [];
