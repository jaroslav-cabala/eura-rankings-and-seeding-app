export enum RankedEntity {
  Individual = "individual",
  Team = "team"
}

export enum Category {
  Open = "open",
  Women = "women",
  Mixed = "mixed"
}

export enum Division {
  Pro = "pro",
  Contender = "contender",
  Advanced = "advanced"
}

export const apiEndpoints = {
  openRankingsTeams: "rankings/open/teams",
  womenRankingsTeams: "rankings/women/teams",
  mixedRankingsTeams: "rankings/mixed/teams",
  openRankingsPlayers: "rankings/open/players",
  womenRankingsPlayers: "rankings/women/players",
  mixedRankingsPlayers: "rankings/mixed/players",
}