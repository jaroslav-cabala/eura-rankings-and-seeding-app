import { createFileRoute, useParams } from "@tanstack/react-router";
import { useGetTournamentDraw } from "@/api/useGetTournamentDraw";
import { Loader2 } from "lucide-react";
import { GroupStageDraw } from "@/components/features/GroupStageDraw/GroupStageDraw";

export const Route = createFileRoute("/tournament-draws/$tournamentDrawId")({
  component: EditTournamentDraw,
});

function EditTournamentDraw() {
  const params = useParams({ from: "/tournament-draws/$tournamentDrawId" });
  const { data, loading, error } = useGetTournamentDraw(params.tournamentDrawId);

  if (error) {
    return (
      <section id="fullscreen-section">
        <div className="loading-screen-wrapper">
          <div className="flex m-auto">Unexpected error.</div>
        </div>
      </section>
    );
  }

  if (loading || !data) {
    return (
      <section>
        <div className="loading-screen-wrapper">
          <div className="flex m-auto">
            <Loader2 className="animate-spin mr-2" />
            Loading data...
          </div>
        </div>
      </section>
    );
  }

  return <GroupStageDraw groupStageDrawId={params.tournamentDrawId} groupStageDrawInitialState={data} />;
}
