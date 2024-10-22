import { GroupStageDrawPlayerDTO } from "@/api/apiTypes";
import { Category, Division } from "@/domain";
import { GroupStageDrawTeam } from "./GroupStageDraw";

export const determineWhetherTeamBelongsInTheSelectedCategoryAndDivision = (
  teams: Array<GroupStageDrawTeam>,
  category: Category,
  divisions: Array<Division>
): Array<GroupStageDrawTeam> => {
  console.log(
    "---------------------------------Determining whether teams belong in the selected category and division"
  );

  // false when both players are in the system(have the uid), are not women and the category is women
  const doesTeamBelongInTheSelectedCategory = (players: Array<GroupStageDrawPlayerDTO>) =>
    category === Category.Women ? players.every((p) => !p.uid || p.isWoman) : true;

  return teams.map<GroupStageDrawTeam>((team) => ({
    ...team,
    belongsInTheSelectedCategory: doesTeamBelongInTheSelectedCategory(team.players),
  }));
};
