import { TimePeriod } from "@/utils";
import { Category, Division } from "../domain";

export const teamPointsCountMethods = ["sumOfPlayersPoints", "sumOfTeamPoints"] as const;
export type TeamPointsCountMethod = (typeof teamPointsCountMethods)[number];

export type RankedPlayerDTO = {
  id: string;
  uid: string;
  name: string;
  isWoman: boolean;
  tournamentResults: RankedPlayerTournamentResultDTO[];
};

export type RankedTeamDTO = {
  id: string;
  uid: string;
  name: string;
  categories: Array<Category>;
  players: Player[];
  tournamentResults: TournamentResultDTO[];
};

export type TournamentResultDTO = {
  tournamentId: string;
  tournamentResultId: string;
  tournamentName: string;
  date: string;
  rank: number;
  points: number;
  category: Category;
  division: Division;
};

export type RankedPlayerTournamentResultDTO = TournamentResultDTO & {
  team: Team;
};

export type Player = {
  id: string;
  uid: string;
  name: string;
};

export type Team = {
  uid: string;
  name: string;
};

export type TournamentDTO = {
  tournamentId: string;
  name: string;
  date: string;
  divisions: TournamentDivisionDTO[];
};

export type TournamentDivisionDTO = {
  tournamentResultId: string;
  division: Division;
  category: Category;
};

export type TournamentDrawDTO = {
  modified: number;
  id: string;
  name: string;
  divisions: Array<Division>;
  category: Category;
  groups: number;
  powerpools: number;
  powerpoolTeams: number;
  teamPointsCountMethod: TeamPointsCountMethod;
  numberOfBestResultsCountedToPointsTotal: number;
  teams: Array<TournamentDrawTeamDTO>;
};

export type TournamentDrawTeamDTO = Pick<RankedTeamDTO, "name" | "categories" | "tournamentResults"> & {
  uid: string | undefined;
  players: Array<TournamentDrawPlayerDTO>;
};

export type TournamentDrawPlayerDTO = Pick<RankedPlayerDTO, "isWoman" | "name" | "tournamentResults"> & {
  uid: string | undefined;
};

export type TournamentDrawNameAndIdDTO = Pick<TournamentDrawDTO, "id" | "name">;

export type RankedTeamsFilter = {
  teamCategory?: Category;
  includeEntitiesWithNoTournamentResults?: boolean;
} & TournamentResultsFilter;

export type RankedPlayersFilter = {
  playerCategory?: Extract<Category, Category.Open | Category.Women>;
  includeEntitiesWithNoTournamentResults?: boolean;
} & TournamentResultsFilter;

export type TournamentResultsFilter = {
  resultCategories?: Array<Category>;
  resultDivisions?: Array<Division>;
  seasons?: TimePeriod;
};
