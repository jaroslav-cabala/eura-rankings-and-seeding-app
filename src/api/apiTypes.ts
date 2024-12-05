import { TimePeriod } from "@/utils";

export const teamPointsCountMethods = ["sumOfPlayersPoints", "sumOfTeamPoints"] as const;
export type TeamPointsCountMethod = (typeof teamPointsCountMethods)[number];

export type RankedPlayerDTO = {
  id: string;
  fwangoId: string;
  fwangoUid: string;
  name: string;
  isWoman?: boolean;
  tournamentResults: RankedPlayerTournamentResultDTO[];
};

export type RankedTeamDTO = {
  id: string;
  fwangoId: string;
  fwangoUid: string;
  name: string;
  tournamentResults: TournamentResultDTO[];
};

export type RankedTeamWithPlayersDTO = {
  id: string;
  fwangoId: string;
  fwangoUid: string;
  name: string;
  playerOne: RankedPlayerDTO;
  playerTwo: RankedPlayerDTO;
  tournamentResults: TournamentResultDTO[];
};

export type TournamentDTO = {
  fwangoId: string;
  name: string;
  date: string;
  divisions: TournamentDivisionDTO[];
};

export type TournamentDivisionDTO = {
  fwangoResultId: string;
  division: Division;
  category: Category;
};

export type TournamentResultDTO = {
  tournamentFwangoId: string;
  fwangoResultId: string;
  tournamentName: string;
  date: string;
  rank: number;
  points: number;
  category: Category["id"];
  division: Division["id"];
};

export type RankedPlayerTournamentResultDTO = TournamentResultDTO & {
  rankedTeamId: string;
  rankedTeamFwangoId?: string;
  rankedTeamName: string;
};

export type GroupStageDrawDTO = {
  id: string;
  modified: number;
  name: string;
  divisions: Array<Division["id"]>;
  category: Category["id"];
  groups: number;
  powerpools: number;
  powerpoolTeams: number;
  teamPointsCountMethod: TeamPointsCountMethod; // or string ?
  numberOfBestResultsCountedToPointsTotal: number;
  teams: Array<GroupStageDrawTeamDTO>;
};

export type GroupStageDrawTeamDTO = {
  id?: string;
  name: string;
  playerOne: GroupStageDrawPlayerDTO;
  playerTwo: GroupStageDrawPlayerDTO;
  tournamentResults: Array<TournamentResultDTO>;
};

export type GroupStageDrawPlayerDTO = {
  id?: string;
  name: string;
  tournamentResults: Array<RankedPlayerTournamentResultDTO>;
};

export type GroupStageDrawNameIdModifiedDTO = Pick<GroupStageDrawDTO, "id" | "name" | "modified">;

/**
 * Represents a group stage draw data necessary to update it in the db
 */
export type GroupStageDrawInputDTO = Omit<GroupStageDrawDTO, "modified" | "teams"> & {
  teams: Array<GroupStageDrawInputTeamDTO>;
};

/**
 * Represents input data necessary to associate a team with a group stage draw
 * or to create a new team
 */
export type GroupStageDrawInputTeamDTO =
  | GroupStageDrawInputRankedTeamDTO
  | GroupStageDrawInputUnrankedTeamDTO;

export type GroupStageDrawInputRankedTeamDTO = string;

export type GroupStageDrawInputUnrankedTeamDTO = {
  name: string;
  playerOne: GroupStageDrawInputPlayerDTO;
  playerTwo: GroupStageDrawInputPlayerDTO;
};

export type GroupStageDrawInputRankedPlayerDTO = string;

export type GroupStageDrawInputUnrankedPlayerDTO = { name: string };

export type GroupStageDrawInputPlayerDTO =
  | GroupStageDrawInputRankedPlayerDTO
  | GroupStageDrawInputUnrankedPlayerDTO;

export type TeamsFilterDTO = {
  teamCategory?: Category;
} & TournamentResultsFilterDTO;

export type PlayersFilterDTO = {
  playerCategory?: Category["id"];
} & TournamentResultsFilterDTO;

export type TournamentResultsFilterDTO = {
  resultCategories?: Array<Category["id"]>;
  resultDivisions?: Array<Division["id"]>;
  seasons?: TimePeriod;
  includeEntitiesWithNoTournamentResults?: boolean;
};

export type Category = {
  id: number;
  name: string;
};

export type Division = {
  id: number;
  name: string;
};
