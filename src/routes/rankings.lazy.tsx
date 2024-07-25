import { createLazyFileRoute } from "@tanstack/react-router";
import { Rankings } from "@/components/features/Rankings/Rankings";

export const Route = createLazyFileRoute("/rankings")({
  component: Rankings,
});
