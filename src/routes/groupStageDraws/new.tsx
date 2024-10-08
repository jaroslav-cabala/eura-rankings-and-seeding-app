import { GroupStageDraw } from "@/components/features/GroupStageDraw/GroupStageDraw";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/groupStageDraws/new")({
  component: () => <GroupStageDraw />,
});
