import { TeamPointsCountMethod, GroupStageDrawDTO, GroupStageDrawTeamDTO } from "@/api/apiTypes";
import { Category, Division } from "@/domain";

export enum groupStageDrawReducerActionType {
  SetPowerpoolTeamsCount = "SetPowerpoolTeamsCount",
  SetPowerpoolGroupsCount = "SetPowerpoolGroupsCount",
  SetGroupsCount = "SetGroupsCount",
  SetTeamPointsCountMethod = "SetTeamPointsCountMethod",
  SetNumberOfBestResultsCountedToPointsTotal = "SetNumberOfBestResultsCountedToPointsTotal",
  SetName = "SetName",
  SetCategory = "SetCategory",
  SetDivisions = "SetDivisions",
  AddTeam = "AddTeam",
  RemoveTeam = "RemoveTeam",
  RemoveAllTeams = "RemoveAllTeams",
  SetTeams = "SetTems",
  Reset = "Reset",
}

type SetPowerpoolTeamsCountAction = {
  type: groupStageDrawReducerActionType.SetPowerpoolTeamsCount;
  powerpoolTeamsCount: string;
};

type SetPowerpoolGroupsCountAction = {
  type: groupStageDrawReducerActionType.SetPowerpoolGroupsCount;
  powerpoolGroupsCount: string;
};

type SetGroupsCountAction = {
  type: groupStageDrawReducerActionType.SetGroupsCount;
  groupsCount: string;
};

type SetTeamPointsCountMethodAction = {
  type: groupStageDrawReducerActionType.SetTeamPointsCountMethod;
  teamPointsCountMethod: TeamPointsCountMethod;
};

type SetNumberOfBestResultsCountedToPointsTotal = {
  type: groupStageDrawReducerActionType.SetNumberOfBestResultsCountedToPointsTotal;
  numberOfBestResultsCountedToPointsTotal: number;
};

type SetNameAction = {
  type: groupStageDrawReducerActionType.SetName;
  name: string;
};

type SetCategory = {
  type: groupStageDrawReducerActionType.SetCategory;
  category: Category;
};

type SetDivisions = {
  type: groupStageDrawReducerActionType.SetDivisions;
  divisions: Array<Division>;
};

type AddTeamAction = {
  type: groupStageDrawReducerActionType.AddTeam;
  team: GroupStageDrawTeamDTO;
};

type RemoveTeamAction = {
  type: groupStageDrawReducerActionType.RemoveTeam;
  teamUid: string | undefined;
  teamName: string;
};

type RemoveAllTeamsAction = {
  type: groupStageDrawReducerActionType.RemoveAllTeams;
};

type SetTeamsAction = {
  type: groupStageDrawReducerActionType.SetTeams;
  teams: Array<GroupStageDrawTeamDTO>;
};

type ResetAction = {
  type: groupStageDrawReducerActionType.Reset;
};

export type GroupStageDrawReducerActionTypes =
  | SetPowerpoolTeamsCountAction
  | SetPowerpoolGroupsCountAction
  | SetGroupsCountAction
  | SetTeamPointsCountMethodAction
  | SetNumberOfBestResultsCountedToPointsTotal
  | SetNameAction
  | SetCategory
  | SetDivisions
  | AddTeamAction
  | RemoveTeamAction
  | RemoveAllTeamsAction
  | SetTeamsAction
  | ResetAction;

//TODO how to handle string to number conversion
export const groupStageDrawReducer = (
  tournamentDraw: GroupStageDrawDTO,
  action: GroupStageDrawReducerActionTypes
): GroupStageDrawDTO => {
  switch (action.type) {
    case groupStageDrawReducerActionType.SetPowerpoolTeamsCount: {
      return {
        ...tournamentDraw,
        powerpoolTeams: Number(action.powerpoolTeamsCount),
      };
    }
    case groupStageDrawReducerActionType.SetPowerpoolGroupsCount: {
      return {
        ...tournamentDraw,
        powerpools: Number(action.powerpoolGroupsCount),
      };
    }
    case groupStageDrawReducerActionType.SetGroupsCount: {
      return {
        ...tournamentDraw,
        groups: Number(action.groupsCount),
      };
    }
    case groupStageDrawReducerActionType.SetTeamPointsCountMethod: {
      return {
        ...tournamentDraw,
        teamPointsCountMethod: action.teamPointsCountMethod,
      };
    }
    case groupStageDrawReducerActionType.SetNumberOfBestResultsCountedToPointsTotal: {
      return {
        ...tournamentDraw,
        numberOfBestResultsCountedToPointsTotal: action.numberOfBestResultsCountedToPointsTotal,
      };
    }
    case groupStageDrawReducerActionType.SetName: {
      return {
        ...tournamentDraw,
        name: action.name,
      };
    }
    case groupStageDrawReducerActionType.SetCategory: {
      return {
        ...tournamentDraw,
        category: action.category,
      };
    }
    case groupStageDrawReducerActionType.SetDivisions: {
      return {
        ...tournamentDraw,
        divisions: action.divisions,
      };
    }
    case groupStageDrawReducerActionType.AddTeam: {
      return {
        ...tournamentDraw,
        teams: [...tournamentDraw.teams, action.team],
      };
    }
    case groupStageDrawReducerActionType.RemoveTeam: {
      return {
        ...tournamentDraw,
        teams: tournamentDraw.teams.filter((team) =>
          action.teamUid ? team.uid !== action.teamUid : team.name !== action.teamName
        ),
      };
    }
    case groupStageDrawReducerActionType.RemoveAllTeams: {
      return {
        ...tournamentDraw,
        teams: [],
      };
    }
    case groupStageDrawReducerActionType.SetTeams: {
      return {
        ...tournamentDraw,
        teams: action.teams,
      };
    }
    case groupStageDrawReducerActionType.Reset: {
      return {
        ...tournamentDraw,
        groups: 0,
        powerpools: 0,
        powerpoolTeams: 0,
        teams: [],
      };
    }
    default: {
      const actionType: never = action;
      throw new Error(`Didn't expect to get here, ${actionType}`);
    }
  }
};
