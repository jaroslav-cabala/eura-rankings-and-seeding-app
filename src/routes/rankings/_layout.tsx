import { defaultRankingsFilterState } from "@/components/features/Rankings/settings";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rankings/_layout")({
  component: RankingsComponent,
});

function RankingsComponent() {
  console.log("Rankings component");

  return (
    <>
      <NavigationMenu className="p-2">
        <NavigationMenuList>
          <NavigationMenuItem className="mx-2">
            <Link
              to="/rankings/individual"
              search={{ ...defaultRankingsFilterState }}
              className="[&.active]:font-bold"
              activeOptions={{ includeSearch: false }}
            >
              Individual Rankings
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/rankings/team"
              search={{ ...defaultRankingsFilterState }}
              className="[&.active]:font-bold"
              activeOptions={{ includeSearch: false }}
            >
              Team Rankings
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Outlet />
    </>
  );
}
