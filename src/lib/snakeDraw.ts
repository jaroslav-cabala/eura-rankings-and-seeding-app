export type Group<T> = { teams: Array<T> };

/**
 * Draws teams into groups using the snake method.
 * Teams passed as a parameter have to be sorted in ascending order(team with least points is first in the array).
 * First seed in the first group is the team with most seeding points.
 * @param teams teams to draw into groups
 * @param noGroups number of groups
 * @returns R an array of groups with teams.
 *  If 'teams' parameter is empty array or 'noGroups' is 0, returns empty array.
 */
export const snakeDraw = <TeamType>(
  teams: Array<TeamType>,
  noGroups: number
): Array<Group<TeamType>> | undefined => {
  const groups: Array<Group<TeamType>> = Array(noGroups)
    .fill(0)
    .map(() => ({ teams: [] }));

  if (!teams.length || !noGroups) {
    return [];
  }

  // count how many times was the groups order reverses(to achieve the snake draw)
  let groupOrderReversalCount = 0;

  while (teams.length) {
    for (const group of groups) {
      const team = teams.pop();

      if (team) {
        group.teams.push(team);
      } else {
        break; //no teams left to put into groups, stop loop early
      }
    }

    if (teams.length) {
      groups.reverse();
      groupOrderReversalCount = groupOrderReversalCount + 1;
      // if there's more teams left to put into groups,
      // reverse the groups in order to accomplish snake draw(1,8 | 2,7 | 3,6 | 4,5)
    }
  }

  // if number of group reversal is odd, one more group reversal is needed
  // so the first group is the group with first seed(a team with most points)
  if (Math.abs(groupOrderReversalCount % 2) === 1) {
    groups.reverse();
  }

  return groups;
};
