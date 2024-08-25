import { Category, Division } from "../domain";

export type RankedPlayer = {
  id: string;
  uid: string;
  name: string;
  tournamentResults: RankedPlayerTournamentResult[];
};

export type RankedPlayerTournamentResult = {
  tournamentId: string;
  tournamentResultId: string;
  tournamentName: string;
  date: string;
  rank: number;
  points: number;
  division: Division;
  team: Team;
};

export type RankedTeam = {
  id: string;
  uid: string;
  name: string;
  players: Player[];
  tournamentResults: RankedTeamTournamentResult[];
};

export type RankedTeamTournamentResult = {
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

export type Tournament = {
  tournamentId: string;
  name: string;
  date: string;
  results: TournamentDivisionDTO[];
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
  teams: Array<RankedTeam>;
};
