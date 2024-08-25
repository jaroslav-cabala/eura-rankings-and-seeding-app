import { createFileRoute } from "@tanstack/react-router";
import { TournamentDraw } from "@/components/features/TournamentDraw/TournamentDraw";

export const Route = createFileRoute("/tournament-draws/$tournamentDrawId")({
  component: TournamentDraw,
});
