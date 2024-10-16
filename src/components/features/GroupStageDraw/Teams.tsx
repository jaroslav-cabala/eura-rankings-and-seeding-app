import { Dispatch } from "react";
import { Trash2 } from "lucide-react";
import { TeamPointsCountMethod } from "@/api/apiTypes";
import { Button } from "@/components/ui/button";
import { GroupStageDrawTeam } from "./GroupStageDraw";
import { groupStageDrawReducerActionType, GroupStageDrawReducerActionTypes } from "./groupStageDrawReducer";

type TeamsProps = {
  removeTeam: Dispatch<
    Extract<GroupStageDrawReducerActionTypes, { type: groupStageDrawReducerActionType.RemoveTeam }>
  >;
  teams: Array<GroupStageDrawTeam>;
  teamPointsCountMethod: TeamPointsCountMethod;
};

export const Teams: React.FC<TeamsProps> = ({ removeTeam, teams, teamPointsCountMethod }) => {
  return (
    <ol className={teams.length ? "" : "m-auto"}>
      {teams.map((team) => (
        <li
          className="tournament-team shadow-sm"
          data-invalid={!team.belongsInTheSelectedCategory}
          key={team.uid ?? `${team.players[0].name}_${team.players[1].name}`}
        >
          <div>
            <div className="font-medium">
              {`${team.name}`}&nbsp;&nbsp;{`(${team.points} points)`}
            </div>
            <div className="grey-text">
              {teamPointsCountMethod === "sumOfPlayersPoints"
                ? `${team.players[0].name} (${team.players[0].points}), ${team.players[1].name} (${team.players[1].points})`
                : `${team.players[0].name}, ${team.players[1].name}`}
            </div>
          </div>
          <div>
            <Button
              onClick={() =>
                removeTeam({
                  type: groupStageDrawReducerActionType.RemoveTeam,
                  teamUid: team.uid,
                  teamName: team.name,
                })
              }
              title="Delete team"
              size="icon"
              variant="icon"
              className="hover:text-[hsl(var(--destructive))]"
            >
              <Trash2 />
            </Button>
          </div>
        </li>
      ))}
      {teams.length === 0 && (
        <li className="p-10 text-center text-muted-foreground">No teams in the tournament. Add some!</li>
      )}
    </ol>
  );
};
