import { TournamentDraw } from "@/components/features/TournamentDraw/TournamentDraw";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tournament-draws/new")({
  component: () => <TournamentDraw />,
});
