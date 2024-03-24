import { TournamentDrawSettings, Group, TournamentDraw } from "./TournamentDraw";
import { ParticipatingTeam } from "./types";

export const drawGroups = (
  participatingTeams: ParticipatingTeam[],
  tournamentDrawSettings: TournamentDrawSettings
): TournamentDraw | undefined => {
  const numberOfGroups = Number(tournamentDrawSettings.groups);
  const groups: Array<Group> = Array(numberOfGroups).fill(0).map(() => ({ teams: [] }))
  let powerpools: Array<Group> | undefined = undefined;

  const _participatingTeams = [...participatingTeams].sort((a, b) => b.points - a.points);

  if (Number(tournamentDrawSettings.powerpoolGroups)) {
    powerpools = drawPowerpools(
      _participatingTeams,
      Number(tournamentDrawSettings.powerpoolGroups),
      Number(tournamentDrawSettings.powerpoolTeams)
    );
  }

  _participatingTeams.reverse();
  while (_participatingTeams.length) {
    for (const group of groups) {
      const team = _participatingTeams.pop();
      if (team) {
        group.teams.push(team);
      } else if (!team && _participatingTeams.length) {
        // if for some reason there's no team left to add to a group but there should,
        // group draw is invalid - return undefined
        return undefined;
      }
    }
  }

  return {
    groups,
    powerpools
  };
};

const drawPowerpools = (
  participatingTeams: Array<ParticipatingTeam>,
  noPowerpoolGroups: number,
  noPowerpoolTeams: number,
): TournamentDraw["powerpools"] => {
  const powerpoolGroups: Array<Group> = Array(noPowerpoolGroups).fill(0).map(() => ({ teams: [] }));
  const powerpoolTeams = participatingTeams.splice(0, noPowerpoolTeams).reverse();

  while (powerpoolTeams.length) {
    for (const group of powerpoolGroups) {
      const team = powerpoolTeams.pop();
      if (team) {
        group.teams.push(team);
      } else if (!team && powerpoolTeams.length) {
        // if for some reason there's no team left to add to a group but there should be,
        // group draw is invalid - return undefined
        return undefined;
      }
    }
  }

  return powerpoolGroups;
};
