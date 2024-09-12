import { Dispatch } from "react";
import { Trash2 } from "lucide-react";
import { TeamPointsCountMethod } from "@/api/apiTypes";
import { Button } from "@/components/ui/button";
import { TournamentDrawTeamWithPoints } from "./TournamentDraw";
import { TournamentDrawReducerActionType, TournamentDrawReducerActionTypes } from "./tournamentDrawReducer";

type TeamsProps = {
  removeTeam: Dispatch<
    Extract<TournamentDrawReducerActionTypes, { type: TournamentDrawReducerActionType.RemoveTeam }>
  >;
  teams: Array<TournamentDrawTeamWithPoints>;
  teamPointsCountMethod: TeamPointsCountMethod;
};

export const Teams: React.FC<TeamsProps> = ({ removeTeam, teams, teamPointsCountMethod }) => {
  return (
    <ol>
      {teams.map((team) => (
        <li key={team.id ?? `${team.players[0].name}_${team.players[1].name}`}>
          <div id="team-info">
            <div className="team-name">{`${team.name} (${team.points} points)`}</div>
            <div className="team-players">
              {teamPointsCountMethod === "sumOfPlayersPoints"
                ? `${team.players[0].name} (${team.players[0].points}), ${team.players[1].name} (${team.players[1].points})`
                : `${team.players[0].name}, ${team.players[1].name}`}
            </div>
          </div>
          <div id="team-actions">
            <Button
              onClick={() =>
                removeTeam({
                  type: TournamentDrawReducerActionType.RemoveTeam,
                  teamId: team.id,
                  teamName: team.name,
                })
              }
              title="Delete team"
              size="icon"
              variant="icon"
              className="hover:text-red-500"
            >
              <Trash2 />
            </Button>
          </div>
        </li>
      ))}
    </ol>
  );
};

// // TODO improve this type with never. There are 2 options - either we count player points
// // in which case team points is sum of the player points
// // or we count team points in which case players have no points
// type TournamentDrawTeamWithPoints = Pick<
//   TournamentDrawTeamDTO,
//   "id" | "uid" | "name" | "tournamentResults"
// > & {
//   points: number;
//   players: Array<TournamentDrawPlayerDTO & { points: number }>;
// };

// const sortTeamsByPoints = (
//   data: Array<TournamentDrawTeamDTO> | undefined,
//   teamPointsCountMethod: TeamPointsCountMethod,
//   numberOfResultsCountedToPointsTotal: number
// ): Array<TournamentDrawTeamWithPoints> =>
//   teamPointsCountMethod === "sumOfTeamPoints"
//     ? data
//         ?.map<TournamentDrawTeamWithPoints>((team) => ({
//           ...team,
//           players: team.players.map((player) => ({ ...player, points: 0 })),
//           points: getTotalPointsFromXBestResults(team.tournamentResults, numberOfResultsCountedToPointsTotal),
//         }))
//         .sort((teamA, teamB) => teamB.points - teamA.points) ?? []
//     : data
//         ?.map<TournamentDrawTeamWithPoints>((team) => {
//           const players = team.players.map((player) => ({
//             ...player,
//             points: getTotalPointsFromXBestResults(
//               player.tournamentResults,
//               numberOfResultsCountedToPointsTotal
//             ),
//           }));
//           return {
//             ...team,
//             players,
//             points: players[0].points + players[1].points,
//           };
//         })
//         .sort((teamA, teamB) => teamB.points - teamA.points) ?? [];
