import { RankedPlayerDTO, RankedTeamDTO } from "./api/apiTypes";

export enum RankedEntity {
  Individual = "individual",
  Team = "team",
}

// use types from api ???
export enum Category {
  Open = "open",
  Women = "women",
  Mixed = "mixed",
}

export enum Division {
  Pro = "pro",
  Contender = "contender",
}

export type RankedPlayer = RankedPlayerDTO & {
  points: number;
};

export type RankedTeam = RankedTeamDTO & {
  points: number;
};
