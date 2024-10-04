import { defaultFilterForRankings } from "@/components/features/Rankings/settings";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rankings/_layout")({
  component: RankingsComponent,
});

function RankingsComponent() {
  console.log("Rankings component");

  return (
    <div className="p-2 min-w-[400px] max-w-[700px] m-auto lg:min-w-[800px] lg:max-w-[1000px]">
      <NavigationMenu aria-label="Rankings" className="py-6">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              to="/rankings/individual"
              search={{ ...defaultFilterForRankings }}
              activeOptions={{ includeSearch: false }}
              className={cn(
                "[&.active]:text-primary [&.active]:bg-accent text-lg [&.active]:shadow-sm",
                navigationMenuTriggerStyle()
              )}
            >
              Individual Rankings
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/rankings/team"
              search={{ ...defaultFilterForRankings }}
              activeOptions={{ includeSearch: false }}
              className={cn(
                "[&.active]:text-primary [&.active]:bg-accent text-lg [&.active]:shadow-sm",
                navigationMenuTriggerStyle()
              )}
            >
              Team Rankings
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
