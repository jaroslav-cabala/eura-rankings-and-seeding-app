import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/group-stage-draws/")({
  component: GroupStageDrawsIndexComponent,
});

function GroupStageDrawsIndexComponent() {
  return (
    <section className="w-full flex justify-center">
      <p className="hidden lg:block text-2xl font-semibold content-center px-6">
        Select a group stage draw or create new
      </p>
      {/* TODO render some placeholder background for screens smaller than lg */}
    </section>
  );
}
