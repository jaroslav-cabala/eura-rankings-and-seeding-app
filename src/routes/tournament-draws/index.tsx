import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import "./index.css";
import { useGetTournamentDraws } from "@/api/useGetTournamentDraws";
import { CirclePlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OverflowTooltip } from "@/components/ui/EllipsisTooltip";

export const Route = createFileRoute("/tournament-draws/")({
  component: GroupStageDrawsComponent,
});

function GroupStageDrawsComponent() {
  const navigate = useNavigate({ from: "/tournament-draws" });
  const { data, loading, error } = useGetTournamentDraws();

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

  return (
    <section className="min-w-[400px] flex flex-col items-center justify-center gap-12 py-32 px-2 lg:flex-row">
      <Card className="max-h-[700px]">
        <CardHeader className="items-center">
          <CardTitle>Edit a group stage draw</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {data?.map((t) => (
            <OverflowTooltip content={t.name}>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: `/tournament-draws/${t.id}` })}
                className="text-base justify-start w-[350px] xl:w-[420px] 2xl:w-[460px] px-3"
              >
                <span className="text-ellipsis overflow-hidden">{t.name}</span>
              </Button>
            </OverflowTooltip>
          ))}
        </CardContent>
      </Card>
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
