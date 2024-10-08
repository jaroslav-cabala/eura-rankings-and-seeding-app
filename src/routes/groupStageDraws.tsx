import { useGetTournamentDraws } from "@/api/useGetTournamentDraws";
import { TournamentDrawsMenu } from "@/components/features/GroupStageDraw/TournamentDrawsMenu";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/groupStageDraws")({
  component: GroupStageDrawsComponent,
});

function GroupStageDrawsComponent() {
  const { data, loading, error } = useGetTournamentDraws();
  console.log("group stage draws menu");

  if (error) {
    return (
      <section>
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

  return (
    <div className="w-full flex flex-col px-2 py-6 gap-y-10 lg:flex-row lg:gap-x-6">
      <TournamentDrawsMenu />
      <Outlet />
    </div>
  );
}
