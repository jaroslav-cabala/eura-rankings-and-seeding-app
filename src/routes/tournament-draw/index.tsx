import { createFileRoute } from "@tanstack/react-router";
import { TournamentDraw } from "@/components/features/TournamentDraw/TournamentDraw";

export const Route = createFileRoute("/tournament-draw/")({
  component: TournamentDraw,
});

// function TournamentDrawComponent() {
//   return (
//     <>
//       <div>Hello from tournamentDraw component</div>
//     </>
//   );
// }
