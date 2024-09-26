import { createFileRoute, useParams } from "@tanstack/react-router";
import { TournamentDraw } from "@/components/features/TournamentDraw/TournamentDraw";
import { useGetTournamentDraw } from "@/api/useGetTournamentDraw";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/tournament-draws/$tournamentDrawId")({
  component: EditTournamentDraw,
});

function EditTournamentDraw() {
  const params = useParams({ from: "/tournament-draws/$tournamentDrawId" });
  const { data, loading, error } = useGetTournamentDraw(params.tournamentDrawId);

  if (error) {
    return (
      <section id="fullscreen-section">
        <div className="py-2">Error while fetching tournament draw data</div>
      </section>
    );
  }

  if (loading || !data) {
    return (
      <section>
        <div className="py-2">
          <Loader2 className="animate-spin mr-2" />
          Loading tournament draw data...
        </div>
      </section>
    );
  }

  return <TournamentDraw tournamentDrawId={params.tournamentDrawId} tournamentDrawInitial={data} />;
}
