import { Player } from "@/src/app/api/types";

export type ParticipatingTeam = {
  id?: string;
  name: string;
  playerOne: Player;
  playerTwo: Player;
  points: number;
};