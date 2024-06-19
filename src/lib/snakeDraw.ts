export type Group<T> = { teams: Array<T> };

export const snakeDraw = <TeamType>(
  teams: Array<TeamType>,
  noGroups: number
): Array<Group<TeamType>> | undefined => {
  const groups: Array<Group<TeamType>> = Array(noGroups)
    .fill(0)
    .map(() => ({ teams: [] }));

  const groupsCopy = groups.slice();
  while (teams.length) {
    for (const group of groupsCopy) {
      const team = teams.pop();

      if (team) {
        group.teams.push(team);
      } else if (!team && teams.length) {
        // if for some reason there's no team left to add to a group but there should be,
        // group draw is invalid - return undefined
        return undefined;
      }
    }

    groupsCopy.reverse(); // reverse the groups in order to accomplish snake draw(1,8 | 2,7 | 3,6 | 4,5)
  }

  return groups;
};
