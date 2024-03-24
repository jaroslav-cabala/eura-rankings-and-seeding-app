export interface RankedPlayer {
  id: string;
  uid: string;
  name: string;
  tournamentResults: RankedPlayerTournamentResult[];
}

export interface RankedPlayerTournamentResult {
  tournamentId: string;
  tournamentResultId: string;
  tournamentName: string;
  date: string;
  points: number;
  rank: number;
  team: Team;
}

export interface Team {
  uid: string;
  name: string;
}

export interface RankedTeam {
  id: string;
  uid: string;
  name: string;
  players: Player[];
  tournamentResults: RankedTeamTournamentResult[];
}

export interface Player {
  id: string;
  uid: string;
  name: string;
}

export interface RankedTeamTournamentResult {
  rank: number;
  points: number;
  tournamentName: string;
  tournamentId: string;
  tournamentResultId: string;
  date: string;
}
