import { Player } from "@/apiTypes";

export type ParticipatingTeam = {
  id?: string;
  name: string;
  playerOne: Player;
  playerTwo: Player;
  points: number;
};