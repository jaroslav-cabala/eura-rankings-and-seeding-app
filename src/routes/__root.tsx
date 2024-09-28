import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Toaster } from "@/components/ui/toaster";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
export const Route = createRootRoute({
  component: () => (
    <>
      <div className="bg-[hsl(var(--accent))]">
        <NavigationMenu className="p-4 m-auto text-xl">
          <NavigationMenuList className="gap-4">
            <NavigationMenuItem>
              <Link to="/rankings" className="[&.active]:font-bold">
                Rankings
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/tournament-draws" className="[&.active]:font-bold">
                Tournament Draws
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/management" className="[&.active]:font-bold">
                Management
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <hr />
      <Outlet />
      <Toaster />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
