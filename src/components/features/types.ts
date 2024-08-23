import { Player } from "@/api/apiTypes";

export type ParticipatingTeam = {
  id?: string;
  name: string;
  playerOne: Player & { points: number };
  playerTwo: Player & { points: number };
  points: number;
};
