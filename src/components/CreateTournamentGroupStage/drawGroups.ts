import { snakeDraw } from "../../lib/snakeDraw";
import { ParticipatingTeam } from "../types";
import { Group, GroupStage, GroupStageSettings } from "./GroupStage";

export const drawGroups = (
  participatingTeams: ParticipatingTeam[],
  tournamentDrawSettings: GroupStageSettings
): GroupStage | undefined => {
  let powerpools: Array<Group> | undefined = undefined;

  const _participatingTeams = [...participatingTeams].sort((a, b) => b.points - a.points);

  if (tournamentDrawSettings.powerpools) {
    powerpools = drawPowerpools(
      _participatingTeams,
      Number(tournamentDrawSettings.powerpoolGroups),
      Number(tournamentDrawSettings.powerpoolTeams)
    );
  }

  _participatingTeams.reverse();
  const groups = snakeDraw<ParticipatingTeam>(_participatingTeams, Number(tournamentDrawSettings.groups));

  return {
    groups,
    powerpools,
  };
};

const drawPowerpools = (
  participatingTeams: Array<ParticipatingTeam>,
  noPowerpoolGroups: number,
  noPowerpoolTeams: number
): GroupStage["powerpools"] => {
  const powerpoolTeams = participatingTeams.splice(0, noPowerpoolTeams).reverse();
  const powerpoolGroups = snakeDraw<ParticipatingTeam>(powerpoolTeams, noPowerpoolGroups);

  return powerpoolGroups;
};
