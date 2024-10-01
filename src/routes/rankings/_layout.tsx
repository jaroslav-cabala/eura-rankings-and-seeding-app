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
    <section className="p-2 pt-0 min-w-[500px] max-w-[700px] m-auto lg:min-w-[800px] lg:max-w-[1000px]">
      <div className="py-6">
        <NavigationMenu aria-label="Rankings" className="">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                to="/rankings/individual"
                search={{ ...defaultFilterForRankings }}
                activeOptions={{ includeSearch: false }}
                className={cn("[&.active]:text-primary [&.active]:bg-accent", navigationMenuTriggerStyle())}
              >
                Individual Rankings
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/rankings/team"
                search={{ ...defaultFilterForRankings }}
                activeOptions={{ includeSearch: false }}
                className={cn("[&.active]:text-primary [&.active]:bg-accent", navigationMenuTriggerStyle())}
              >
                Team Rankings
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Outlet />
    </section>
  );
}
