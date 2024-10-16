import { GroupStageDrawNameAndIdDTO } from "@/api/apiTypes";
import { fetchData } from "@/api/fetchData";
import { FullScreenError } from "@/components/common/FullScreenError";
import { FullScreenPending } from "@/components/common/FullScreenPending";
import { GroupStageDrawsMenu } from "@/components/features/GroupStageDraw/GroupStageDrawMenu/GroupStageDrawsMenu";
import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/group-stage-draws")({
  loader: ({ abortController }) =>
    fetchData<Array<GroupStageDrawNameAndIdDTO>>({
      url: `http:localhost:3001/groupstage-draws`,
      requestInit: {
        signal: abortController.signal,
      },
    }),
  component: GroupStageDrawsComponent,
  pendingComponent: FullScreenPending,
  errorComponent: FullScreenError,
  gcTime: 0,
  shouldReload: false,
});

function GroupStageDrawsComponent() {
  const data = Route.useLoaderData();

  console.log("GroupStageDraws route");

  return (
    <div className="w-full flex flex-col gap-y-10 lg:flex-row lg:gap-x-8 p-2 pt-8">
      <GroupStageDrawsMenu groupStageDrawsInitial={data} />
      <Outlet />
    </div>
  );
}
