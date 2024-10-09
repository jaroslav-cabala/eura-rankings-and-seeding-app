import { createFileRoute, useParams } from "@tanstack/react-router";
import { useGetTournamentDraw } from "@/api/useGetTournamentDraw";
import { Loader2 } from "lucide-react";
import { GroupStageDraw } from "@/components/features/GroupStageDraw/GroupStageDraw";

export const Route = createFileRoute("/groupStageDraws/$groupStageDrawId")({
  component: EditTournamentDraw,
});

function EditTournamentDraw() {
  const params = useParams({ from: "/groupStageDraws/$groupStageDrawId" });
  const { data, loading, error } = useGetTournamentDraw(params.groupStageDrawId);

  if (error) {
    return (
      <section>
        <div className="fixed-centered-content">
          <div className="flex m-auto">Unexpected error.</div>
        </div>
      </section>
    );
  }

  if (loading || !data) {
    return (
      <section>
        <div className="fixed-centered-content">
          <div className="flex m-auto">
            <Loader2 className="animate-spin mr-2" />
            Loading data...
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <GroupStageDraw groupStageDrawId={params.groupStageDrawId} groupStageDrawInitialState={data} />
    </>
  );
}
