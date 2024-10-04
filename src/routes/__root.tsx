import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Toaster } from "@/components/ui/toaster";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
export const Route = createRootRoute({
  component: () => (
    <>
      <header className="bg-[hsl(var(--accent))]">
        <NavigationMenu className="h-16 p-4 m-auto text-xl">
          <NavigationMenuList className="gap-4">
            <NavigationMenuItem>
              <Link
                to="/rankings"
                className="[&.active]:text-primary font-bold text-muted-foreground/90 hover:text-primary"
              >
                Rankings
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/tournament-draws"
                className="[&.active]:text-primary font-bold text-muted-foreground/90 hover:text-primary"
              >
                Tournament Draws
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/management"
                className="[&.active]:text-primary font-bold text-muted-foreground/90 hover:text-primary"
              >
                Management
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <hr />
      </header>
      <main>
        <Outlet />
        <Toaster />
      </main>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
