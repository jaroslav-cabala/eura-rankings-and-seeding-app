import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import "./index.css";
import { useGetTournamentDraws } from "@/api/useGetTournamentDraws";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tournament-draws/")({
  component: TournamentDrawsComponent,
});

function TournamentDrawsComponent() {
  const navigate = useNavigate({ from: "/tournament-draws" });
  const { data, loading, error } = useGetTournamentDraws();

  if (error) {
    return (
      <section id="fullscreen-section">
        <div className="py-2">Error while fetching tournament draws</div>
      </section>
    );
  }

  if (loading) {
    return (
      <section>
        <div className="py-2">
          <Loader2 className="animate-spin mr-2" />
          Loading tournament draws...
        </div>
      </section>
    );
  }

  return (
    <section className="flex justify-center gap-12 py-32 px-2">
      <Card className="max-h-[700px]">
        <CardHeader className="items-center">
          <CardTitle>Edit a tournament draw</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {data?.map((t) => (
            <Button
              variant="ghost"
              onClick={() => navigate({ to: `/tournament-draws/${t.id}` })}
              className="text-base justify-start"
            >
              {t.name}
            </Button>
          ))}
        </CardContent>
      </Card>
      <p className="text-2xl font-semibold content-center px-6">Or</p>
      <div className="flex flex-col justify-center items-center">
        <Input placeholder="Tournament draw name..." className="w-[280px] h-12" />
        <Button className="mt-6 px-10 w-fit">
          <Plus className="h-8 w-8 pr-2" />
          <span>Create new</span>
        </Button>
      </div>
    </section>
  );
}
