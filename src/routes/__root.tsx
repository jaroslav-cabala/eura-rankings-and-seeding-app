import { Toaster } from "@/components/ui/toaster";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-4 flex gap-3 text-xl justify-center h-14 bg-[hsl(var(--accent))]">
        <Link to="/rankings" className="[&.active]:font-bold">
          Rankings
        </Link>{" "}
        <Link to="/tournament-draws" className="[&.active]:font-bold">
          Tournament Draw
        </Link>{" "}
        <Link to="/management" className="[&.active]:font-bold">
          Management
        </Link>
      </div>
      <hr />
      <Outlet />
      <Toaster />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
