import { createFileRoute } from "@tanstack/react-router";
import { GroupStageDraw } from "@/components/features/GroupStageDraw/GroupStageDraw";
import { fetchData } from "@/api/fetchData";
import { GroupStageDrawDTO } from "@/api/apiTypes";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/group-stage-draws/$groupStageDrawId")({
  loader: ({ abortController, params }) =>
    fetchData<GroupStageDrawDTO>({
      url: `http:localhost:3001/groupstage-draws/${params.groupStageDrawId}`,
      requestInit: {
        signal: abortController.signal,
      },
    }),
  component: GroupStageDrawComponent,
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
});

function GroupStageDrawComponent() {
  const data = Route.useLoaderData();
  const { groupStageDrawId } = Route.useParams();

  return (
    <section className="w-full">
      <GroupStageDraw
        key={groupStageDrawId}
        groupStageDrawId={groupStageDrawId}
        groupStageDrawInitialState={data}
      />
    </section>
  );
}

function PendingComponent() {
  return (
    <section className="w-full h-full flex m-auto items-center justify-center max-lg:mt-56">
      <Loader2 className="animate-spin mr-2" />
      Loading data...
    </section>
  );
}

function ErrorComponent() {
  return (
    <section className="w-full h-full flex m-auto items-center justify-center">Unexpected error.</section>
  );
}
