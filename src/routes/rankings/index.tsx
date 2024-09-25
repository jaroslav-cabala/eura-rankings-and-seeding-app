import { defaultFilterForRankings } from "@/components/features/Rankings/settings";
import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rankings/")({
  component: () => <Navigate to="/rankings/individual" search={{ ...defaultFilterForRankings }} />,
});
