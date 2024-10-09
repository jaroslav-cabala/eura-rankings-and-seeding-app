import { createFileRoute } from "@tanstack/react-router";
import "./index.css";
import { useGetTournamentDraws } from "@/api/useGetTournamentDraws";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/groupStageDraws/")({
  component: GroupStageDrawsIndexComponent,
});

function GroupStageDrawsIndexComponent() {
  const { data, loading, error } = useGetTournamentDraws();

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
    <section className="w-full flex justify-center px-2">
      <p className="hidden lg:block text-2xl font-semibold content-center px-6">
        Select a group stage draw or create new
      </p>
      {/* render some placeholder background for screens smaller than lg */}
    </section>
  );
}
