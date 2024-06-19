import { snakeDraw } from "../lib/snakeDraw";
import { TournamentDrawSettings, Group, TournamentDraw } from "./TournamentDraw";
import { ParticipatingTeam } from "./types";

export const drawGroups = (
  participatingTeams: ParticipatingTeam[],
  tournamentDrawSettings: TournamentDrawSettings
): TournamentDraw | undefined => {
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
): TournamentDraw["powerpools"] => {
  const powerpoolTeams = participatingTeams.splice(0, noPowerpoolTeams).reverse();
  const powerpoolGroups = snakeDraw<ParticipatingTeam>(powerpoolTeams, noPowerpoolGroups);

  return powerpoolGroups;
};
