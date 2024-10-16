import { TeamPointsCountMethod, GroupStageDrawPlayerDTO, GroupStageDrawTeamDTO } from "@/api/apiTypes";
import { Category, Division } from "@/domain";
import { filterTournamentResults } from "@/lib/filterTournamentResults";
import { getTotalPointsFromXBestResults } from "@/lib/getTotalPointsFromXBestResults";
import { GroupStageDrawTeam } from "./GroupStageDraw";

export const calculateSeedingPointsOfTeams = (
  teams: Array<GroupStageDrawTeamDTO>,
  category: Category,
  divisions: Array<Division>,
  teamPointsCountMethod: TeamPointsCountMethod,
  numberOfResultsCountedToPointsTotal: number
): Array<GroupStageDrawTeam> => {
  console.log("---------------------------------calculating seeding points of teams in the tournament");
  console.log(
    "---------------------------------and determining whether teams belong to the selected category"
  );

  const teamsWithFilteredTournamentResults = teams.map((team) => ({
    ...team,
    players: team.players.map((player) => ({
      ...player,
      tournamentResults: filterTournamentResults(player.tournamentResults, category, divisions),
    })),
    tournamentResults: filterTournamentResults(team.tournamentResults, category, divisions),
  }));

  // false when both players are in the system(have the uid), are not women and the category is women
  const doesTeamBelongInTheSelectedCategory = (players: Array<GroupStageDrawPlayerDTO>) =>
    category === Category.Women ? players.every((p) => !p.uid || p.isWoman) : true;

  return teamPointsCountMethod === "sumOfTeamPoints"
    ? teamsWithFilteredTournamentResults
        ?.map<GroupStageDrawTeam>((team) => ({
          ...team,
          belongsInTheSelectedCategory: doesTeamBelongInTheSelectedCategory(team.players),
          players: team.players.map((player) => ({
            ...player,
            points: 0,
          })),
          points: getTotalPointsFromXBestResults(team.tournamentResults, numberOfResultsCountedToPointsTotal),
        }))
        .sort((teamA, teamB) => teamB.points - teamA.points) ?? []
    : teamsWithFilteredTournamentResults
        ?.map<GroupStageDrawTeam>((team) => {
          const players = team.players.map((player) => ({
            ...player,
            points: getTotalPointsFromXBestResults(
              player.tournamentResults,
              numberOfResultsCountedToPointsTotal
            ),
          }));
          return {
            ...team,
            belongsInTheSelectedCategory: doesTeamBelongInTheSelectedCategory(team.players),
            players,
            points: players[0].points + players[1].points,
          };
        })
        .sort((teamA, teamB) => teamB.points - teamA.points) ?? [];
};
