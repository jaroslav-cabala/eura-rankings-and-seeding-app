import { TournamentDrawDTO } from "@/api/apiTypes";
import { snakeDraw } from "../../../lib/snakeDraw";
import { TournamentDrawTeam } from "./GroupStageDraw";

type GroupStage = {
  powerpools: Array<Array<TournamentDrawTeam>>;
  groups: Array<Array<TournamentDrawTeam>>;
};

/**
 *
 * @param teams
 * @param tournamentDrawSettings
 * @returns An object containing properties 'groups' and 'powerpools'. They can be an empty array if
 * there are no groups or powerpools
 */
export const drawGroups = (
  teams: Array<TournamentDrawTeam>,
  tournamentDrawSettings: Pick<TournamentDrawDTO, "powerpools" | "powerpoolTeams" | "groups">
): GroupStage => {
  let powerpools: Array<Array<TournamentDrawTeam>> = [];

  const teamsCopy = [...teams].sort((a, b) => b.points - a.points);

  // TODO Teams copy is modified here and then used to draw groups.
  // Maybe this could be improved so the function is more clear ?
  const powerpoolTeams = teamsCopy.splice(0, tournamentDrawSettings.powerpoolTeams).reverse();
  powerpools = snakeDraw<TournamentDrawTeam>(powerpoolTeams, tournamentDrawSettings.powerpools);

  teamsCopy.reverse();
  const groups = snakeDraw<TournamentDrawTeam>(teamsCopy, tournamentDrawSettings.groups);

  return {
    groups,
    powerpools,
  };
};
