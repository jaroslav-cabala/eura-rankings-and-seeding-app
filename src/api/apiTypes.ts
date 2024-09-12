import { Category, Division } from "../domain";

export const teamPointsCountMethods = ["sumOfPlayersPoints", "sumOfTeamPoints"] as const;
export type TeamPointsCountMethod = (typeof teamPointsCountMethods)[number];

export type RankedPlayerDTO = {
  id: string;
  uid: string;
  name: string;
  tournamentResults: RankedPlayerTournamentResultDTO[];
};

export type RankedPlayerTournamentResultDTO = {
  tournamentId: string;
  tournamentResultId: string;
  tournamentName: string;
  date: string;
  rank: number;
  points: number;
  division: Division;
  team: Team;
};

export type RankedTeamDTO = {
  id: string;
  uid: string;
  name: string;
  players: Player[];
  tournamentResults: RankedTeamTournamentResultDTO[];
};

export type RankedTeamTournamentResultDTO = {
  tournamentId: string;
  tournamentResultId: string;
  tournamentName: string;
  date: string;
  rank: number;
  points: number;
  division: Division;
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
  id: string;
  name: string;
  divisions: Array<Division>;
  category: Category;
  groups: number;
  powerpools: number;
  powerpoolTeams: number;
  teamPointsCountMethod: TeamPointsCountMethod;
  numberOfResultsCountedToPointsTotal: number;
  teams: Array<TournamentDrawTeamDTO>;
};

export type TournamentDrawTeamDTO = {
  id: string | null;
  uid: string | null;
  name: string;
  players: Array<TournamentDrawPlayerDTO>;
  tournamentResults: Array<RankedTeamTournamentResultDTO>;
};

export type TournamentDrawPlayerDTO = {
  id: string | null;
  uid: string | null;
  name: string;
  tournamentResults: Array<RankedPlayerTournamentResultDTO>;
};

export type TournamentDrawNameAndIdDTO = Pick<TournamentDrawDTO, "id" | "name">;
