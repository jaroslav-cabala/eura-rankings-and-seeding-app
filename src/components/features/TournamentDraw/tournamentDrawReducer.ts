import { TeamPointsCountMethod, TournamentDrawDTO, TournamentDrawTeamDTO } from "@/api/apiTypes";
import { Category, Division } from "@/domain";

export enum TournamentDrawReducerActionType {
  SetPowerpoolTeamsCount = "SetPowerpoolTeamsCount",
  SetPowerpoolGroupsCount = "SetPowerpoolGroupsCount",
  SetGroupsCount = "SetGroupsCount",
  SetTeamPointsCountMethod = "SetTeamPointsCountMethod",
  SetName = "SetName",
  SetCategory = "SetCategory",
  SetDivisions = "SetDivisions",
  AddTeam = "AddTeam",
  RemoveTeam = "RemoveTeam",
  SetTeams = "SetTems",
  Reset = "Reset",
}

type SetPowerpoolTeamsCountAction = {
  type: TournamentDrawReducerActionType.SetPowerpoolTeamsCount;
  powerpoolTeamsCount: string;
};

type SetPowerpoolGroupsCountAction = {
  type: TournamentDrawReducerActionType.SetPowerpoolGroupsCount;
  powerpoolGroupsCount: string;
};

type SetGroupsCountAction = {
  type: TournamentDrawReducerActionType.SetGroupsCount;
  groupsCount: string;
};

type SetTeamPointsCountMethodAction = {
  type: TournamentDrawReducerActionType.SetTeamPointsCountMethod;
  teamPointsCountMethod: TeamPointsCountMethod;
};

type SetNameAction = {
  type: TournamentDrawReducerActionType.SetName;
  name: string;
};

type SetCategory = {
  type: TournamentDrawReducerActionType.SetCategory;
  category: Category;
};

type SetDivisions = {
  type: TournamentDrawReducerActionType.SetDivisions;
  divisions: Array<Division>;
};

type AddTeamAction = {
  type: TournamentDrawReducerActionType.AddTeam;
  team: TournamentDrawTeamDTO;
};

type RemoveTeamAction = {
  type: TournamentDrawReducerActionType.RemoveTeam;
  teamId: string | null;
  teamName: string;
};

type SetTeamsAction = {
  type: TournamentDrawReducerActionType.SetTeams;
  teams: Array<TournamentDrawTeamDTO>;
};

type ResetAction = {
  type: TournamentDrawReducerActionType.Reset;
};

export type TournamentDrawReducerActionTypes =
  | SetPowerpoolTeamsCountAction
  | SetPowerpoolGroupsCountAction
  | SetGroupsCountAction
  | SetTeamPointsCountMethodAction
  | SetNameAction
  | SetCategory
  | SetDivisions
  | AddTeamAction
  | RemoveTeamAction
  | SetTeamsAction
  | ResetAction;

//TODO how to handle string to number conversion
export const tournamentDrawReducer = (
  tournamentDraw: TournamentDrawDTO,
  action: TournamentDrawReducerActionTypes
): TournamentDrawDTO => {
  switch (action.type) {
    case TournamentDrawReducerActionType.SetPowerpoolTeamsCount: {
      return {
        ...tournamentDraw,
        powerpoolTeams: Number(action.powerpoolTeamsCount),
      };
    }
    case TournamentDrawReducerActionType.SetPowerpoolGroupsCount: {
      return {
        ...tournamentDraw,
        powerpools: Number(action.powerpoolGroupsCount),
      };
    }
    case TournamentDrawReducerActionType.SetGroupsCount: {
      return {
        ...tournamentDraw,
        groups: Number(action.groupsCount),
      };
    }
    case TournamentDrawReducerActionType.SetTeamPointsCountMethod: {
      return {
        ...tournamentDraw,
        teamPointsCountMethod: action.teamPointsCountMethod,
      };
    }
    case TournamentDrawReducerActionType.SetName: {
      return {
        ...tournamentDraw,
        name: action.name,
      };
    }
    case TournamentDrawReducerActionType.SetCategory: {
      return {
        ...tournamentDraw,
        category: action.category,
      };
    }
    case TournamentDrawReducerActionType.SetDivisions: {
      return {
        ...tournamentDraw,
        divisions: action.divisions,
      };
    }
    case TournamentDrawReducerActionType.AddTeam: {
      return {
        ...tournamentDraw,
        teams: [...tournamentDraw.teams, action.team],
      };
    }
    case TournamentDrawReducerActionType.RemoveTeam: {
      return {
        ...tournamentDraw,
        teams: tournamentDraw.teams.filter((team) =>
          action.teamId ? team.id !== action.teamId : team.name !== action.teamName
        ),
      };
    }
    case TournamentDrawReducerActionType.SetTeams: {
      return {
        ...tournamentDraw,
        teams: action.teams,
      };
    }
    case TournamentDrawReducerActionType.Reset: {
      return {
        ...tournamentDraw,
        groups: 0,
        powerpools: 0,
        powerpoolTeams: 0,
        teams: [],
      };
    }
  }
};

// When category changes, teams previously added to the tournament might be invalid, e.g men teams are invalid
// in the women category. This function removes all invalid teams.
// const RemoveInvalidTeamsOnCategoryChange (category: Category, teams: Array<TournamentDrawTeamDTO>): Array<TournamentDrawTeamDTO> => {
//   if (category === Category.Women) {
//     return teams.filter(team => team.)
//   }
// }
