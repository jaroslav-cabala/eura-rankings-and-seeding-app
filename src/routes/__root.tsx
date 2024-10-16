import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Toaster } from "@/components/ui/toaster";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
export const Route = createRootRoute({
  component: Root,
});

function Root() {
  console.log("Root - header");
  return (
    <>
      <header className="bg-[hsl(var(--accent))]">
        <NavigationMenu className="h-16 p-4 m-auto text-xl">
          <NavigationMenuList className="gap-4 flex-wrap">
            <NavigationMenuItem>
              <Link
                to="/rankings"
                className="[&.active]:text-primary font-bold text-muted-foreground/85 hover:text-primary"
              >
                Rankings
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/group-stage-draws"
                className="[&.active]:text-primary font-bold text-muted-foreground/85 hover:text-primary"
              >
                Tournament Draws
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/management"
                className="[&.active]:text-primary font-bold text-muted-foreground/85 hover:text-primary"
              >
                Management
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <hr />
      </header>
      <main className="m-auto min-w-[400px] sm:max-lg:max-w-[650px] lg:max-w-[980px] xl:max-w-[2400px]">
        <Outlet />
        <Toaster />
      </main>
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
