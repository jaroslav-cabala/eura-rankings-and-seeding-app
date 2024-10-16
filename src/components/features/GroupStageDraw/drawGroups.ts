import { GroupStageDrawDTO } from "@/api/apiTypes";
import { snakeDraw } from "../../../lib/snakeDraw";
import { GroupStageDrawTeam } from "./GroupStageDraw";

type GroupStage = {
  powerpools: Array<Array<GroupStageDrawTeam>>;
  groups: Array<Array<GroupStageDrawTeam>>;
};

/**
 *
 * @param teams
 * @param tournamentDrawSettings
 * @returns An object containing properties 'groups' and 'powerpools'. They can be an empty array if
 * there are no groups or powerpools
 */
export const drawGroups = (
  teams: Array<GroupStageDrawTeam>,
  tournamentDrawSettings: Pick<GroupStageDrawDTO, "powerpools" | "powerpoolTeams" | "groups">
): GroupStage => {
  let powerpools: Array<Array<GroupStageDrawTeam>> = [];

  const teamsCopy = [...teams].sort((a, b) => b.points - a.points);

  // TODO Teams copy is modified here and then used to draw groups.
  // Maybe this could be improved so the function is more clear ?
  const powerpoolTeams = teamsCopy.splice(0, tournamentDrawSettings.powerpoolTeams).reverse();
  powerpools = snakeDraw<GroupStageDrawTeam>(powerpoolTeams, tournamentDrawSettings.powerpools);

  teamsCopy.reverse();
  const groups = snakeDraw<GroupStageDrawTeam>(teamsCopy, tournamentDrawSettings.groups);

  return {
    groups,
    powerpools,
  };
};
