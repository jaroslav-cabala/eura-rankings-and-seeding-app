import { TournamentDrawDTO } from "@/api/apiTypes";
import { snakeDraw } from "../../../lib/snakeDraw";
import { GroupStage, TournamentDrawTeam } from "./GroupStageDraw";

export const drawGroups = (
  teams: Array<TournamentDrawTeam>,
  tournamentDrawSettings: Pick<TournamentDrawDTO, "powerpools" | "powerpoolTeams" | "groups">
): GroupStage | undefined => {
  let powerpools: Array<Array<TournamentDrawTeam>> | undefined = undefined;

  const teamsCopy = [...teams].sort((a, b) => b.points - a.points);

  // TODO Teams copy is modified here and then used to draw groups.
  // Maybe this could be improved so the function is more clear ?
  if (tournamentDrawSettings.powerpools) {
    powerpools = drawPowerpools(
      teamsCopy,
      tournamentDrawSettings.powerpools,
      tournamentDrawSettings.powerpoolTeams
    );
  }

  teamsCopy.reverse();
  const groups = snakeDraw<TournamentDrawTeam>(teamsCopy, tournamentDrawSettings.groups);

  return {
    groups,
    powerpools,
  };
};

const drawPowerpools = (
  teams: Array<TournamentDrawTeam>,
  noPowerpoolGroups: number,
  noPowerpoolTeams: number
): GroupStage["powerpools"] => {
  const powerpoolTeams = teams.splice(0, noPowerpoolTeams).reverse();
  const powerpoolGroups = snakeDraw<TournamentDrawTeam>(powerpoolTeams, noPowerpoolGroups);

  return powerpoolGroups;
};
