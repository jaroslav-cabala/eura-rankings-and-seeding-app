import { Division } from "./domain";

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
  points: number;
  rank: number;
  team: Team;
  division: Division;
};

export type Team = {
  uid: string;
  name: string;
};

export type RankedTeam = {
  id: string;
  uid: string;
  name: string;
  players: Player[];
  tournamentResults: RankedTeamTournamentResult[];
};

export type Player = {
  id: string;
  uid: string;
  name: string;
};

export type RankedTeamTournamentResult = {
  tournamentId: string;
  tournamentResultId: string;
  tournamentName: string;
  date: string;
  points: number;
  rank: number;
  division: Division;
};

export type RankedTournament = {
  tournamentId: string;
  tournamentResultId: string;
  name: string;
  date: string;
  totalCount: number;
};
