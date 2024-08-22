import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/rankings" className="[&.active]:font-bold">
          Rankings
        </Link>{" "}
        <Link to="/tournament-draw" className="[&.active]:font-bold">
          Tournament Draw
        </Link>{" "}
        <Link to="/management" className="[&.active]:font-bold">
          Management
        </Link>
      </div>
      <hr />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
