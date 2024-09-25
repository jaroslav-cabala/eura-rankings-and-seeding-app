import { RankedPlayerDTO, RankedTeamDTO } from "./api/apiTypes";

export enum RankedEntity {
  Individual = "individual",
  Team = "team",
}

// TODO use types from api ???
export enum Category {
  Open = "open",
  Women = "women",
  Mixed = "mixed",
}

export enum Division {
  Pro = "pro",
  Contender = "contender",
}

// TODO maybe move this type to Rankings feature ?
export type RankedPlayer = RankedPlayerDTO & {
  points: number;
};

export type RankedTeam = RankedTeamDTO & {
  points: number;
};
