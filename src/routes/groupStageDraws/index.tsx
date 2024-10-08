import { createFileRoute } from "@tanstack/react-router";
import "./index.css";
import { useGetTournamentDraws } from "@/api/useGetTournamentDraws";
import { CirclePlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/groupStageDraws/")({
  component: GroupStageDrawsIndexComponent,
});

function GroupStageDrawsIndexComponent() {
  const { data, loading, error } = useGetTournamentDraws();

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
    <section className="min-w-[400px] flex flex-col items-center justify-center gap-12 py-32 px-2 lg:flex-row">
      <p className="text-2xl font-semibold content-center px-6">Select a group stage draw</p>
      <p className="text-2xl font-semibold content-center px-6">Or</p>
      <div className="items-center">
        <Input placeholder="Tournament draw name..." className="w-[350px] shadow-sm" />
        <Button variant="default" className="mt-6 w-full shadow-sm">
          <CirclePlus className="w-6 mr-2" />
          Create new
        </Button>
      </div>
    </section>
  );
}
