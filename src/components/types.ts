import { Player } from "../hooks/types";

export type ParticipatingTeam = {
  id?: string;
  name: string;
  playerOne: Player;
  playerTwo: Player;
  points: number;
};