import { Player, RankedTeamDTO, RankedTeamTournamentResultDTO } from "@/api/apiTypes";
import { createQueryString } from "@/api/createQueryStringsContainingFilters";
import { Division, Category } from "@/domain";

export type RankedTeams = Array<{
  teamId: string;
  teamUid: string;
  name: string;
  playerOne: Player;
  playerTwo: Player;
  points: number;
  tournamentResults: Array<RankedTeamTournamentResultDTO>;
}>;

export const fetchTeams = async (): Promise<Array<RankedTeamDTO>> => {
  const queryStringTeams = createQueryString(Division.Pro, { from: "2024", to: "2024" });
  const fetchResultTeams = await fetch(
    new URL(`http:localhost:3001/rankings/${Category.Open}/teams?${queryStringTeams}`)
  );

  return fetchResultTeams.json();
  // const rankedTeams: Array<RankedTeamDTO> = await fetchResultTeams.json();
  // return sortTeams(rankedTeams, tournamentDrawDefaults.numberOfResultsCountedToPointsTotal);
};

// const sortTeams = (
//   data: Array<RankedTeamDTO> | undefined,
//   numberOfResultsCountedToPointsTotal: number
// ): RankedTeams =>
//   data
//     ?.map<RankedTeams[number]>((team) => ({
//       teamId: team.id,
//       teamUid: team.uid,
//       name: team.name,
//       playerOne: team.players[0],
//       playerTwo: team.players[1],
//       points: getTotalPointsFromXBestResults(team.tournamentResults, numberOfResultsCountedToPointsTotal),
//       tournamentResults: team.tournamentResults,
//     }))
//     .sort((teamA, teamB) => teamB.points - teamA.points) ?? [];
