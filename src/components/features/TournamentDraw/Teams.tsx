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
        <li key={team.uid ?? `${team.players[0].name}_${team.players[1].name}`}>
          <div>
            <div className="font-medium">
              {`${team.name}`}&nbsp;&nbsp;{`(${team.points} points)`}
            </div>
            <div className="lowlighted-text">
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
                  teamUid: team.uid,
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
