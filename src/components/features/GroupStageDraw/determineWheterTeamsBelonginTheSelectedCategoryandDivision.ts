import { Category, Division, GroupStageDrawPlayerDTO } from "@/api/apiTypes";
import { GroupStageDrawTeam } from "./GroupStageDraw";
import { Category as CategoryEnum } from "@/domain";

export const determineWhetherTeamBelongsInTheSelectedCategoryAndDivision = (
  teams: Array<GroupStageDrawTeam>,
  category: Category["id"],
  divisions: Array<Division>
): Array<GroupStageDrawTeam> => {
  console.log(
    "---------------------------------Determining whether teams belong in the selected category and division"
  );

  // false when both players are in the system(have the uid), are not women and the category is women
  const doesTeamBelongInTheSelectedCategory = (players: Array<GroupStageDrawPlayerDTO>) =>
    category.name === CategoryEnum.Women ? players.every((p) => !p.uid || p.isWoman) : true;

  return teams.map<GroupStageDrawTeam>((team) => ({
    ...team,
    belongsInTheSelectedCategory: doesTeamBelongInTheSelectedCategory(team.players),
  }));
};
