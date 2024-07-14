import { createLazyFileRoute } from "@tanstack/react-router";
import { Rankings } from "../components/Rankings";

export const Route = createLazyFileRoute("/rankings")({
  component: Rankings,
});
