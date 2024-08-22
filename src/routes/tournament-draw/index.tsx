import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tournament-draw/")({
  component: TournamentDrawComponent,
});

function TournamentDrawComponent() {
  return (
    <>
      <div>Hello from tournamentDraw component</div>
    </>
  );
}
