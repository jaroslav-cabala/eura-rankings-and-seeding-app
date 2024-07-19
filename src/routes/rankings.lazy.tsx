import { createLazyFileRoute } from "@tanstack/react-router";
import { Rankings } from "@/components/features/Rankings";
import { PlayerRankings } from "@/components/features/PlayerRankings/PlayerRankings";

export const Route = createLazyFileRoute("/rankings")({
  component: PlayerRankings,
});
