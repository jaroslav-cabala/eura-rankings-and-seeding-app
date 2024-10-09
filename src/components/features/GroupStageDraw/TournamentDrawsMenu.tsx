import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftToLine, ArrowRightToLine, Loader2, SquarePlus } from "lucide-react";
import { useGetTournamentDraws } from "@/api/useGetTournamentDraws";
import { Link, useNavigate, UseNavigateResult, useRouterState } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TournamentDrawNameAndIdDTO } from "@/api/apiTypes";
import { cn } from "@/lib/utils";

//TODO
// type TournamentDrawsMenuProps = {
//   // selectedTournamentDrawId: string;
// };

export const TournamentDrawsMenu = () => {
  const { data, loading, error } = useGetTournamentDraws();
  const navigate = useNavigate();

  if (error) {
    return (
      <section>
        <div className="py-2">Error while fetching tournament draws data</div>
      </section>
    );
  }

  if (loading || !data) {
    return (
      <section>
        <div className="py-2">
          <Loader2 className="animate-spin mr-2" />
          Loading tournament draws data...
        </div>
      </section>
    );
  }

  const groupStageDrawsSorted = [...data].sort((a, b) => b.modified - a.modified);
  groupStageDrawsSorted.push({
    id: "13",
    name: "testtttt- super duper long ass fucking groups stage draw name, ffs -------------",
    modified: 3243094509,
  });

  return (
    <>
      <SheetVariant menuItems={groupStageDrawsSorted} navigate={navigate} className="lg:hidden" />
      <SidebarVariant menuItems={groupStageDrawsSorted} navigate={navigate} className="hidden lg:block" />
    </>
  );
};

const SidebarVariant = ({
  menuItems,
  navigate,
  className,
}: {
  menuItems: Array<TournamentDrawNameAndIdDTO>;
  navigate: UseNavigateResult<string>;
  className?: string;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const menuTogglerMarkup = (icon: React.JSX.Element, className?: string) => (
    <Button
      variant="icon"
      size="icon"
      className={cn("justify-self-end hover:bg-[hsl(var(--accent))]", className)}
      onClick={() => setIsMenuOpen((val) => !val)}
    >
      {icon}
    </Button>
  );

  return (
    <aside
      className={cn(
        `p-2 text-center ${isMenuOpen ? "min-w-[320px] lg:min-w-[360px]" : "w-auto mr-8"}`,
        className
      )}
    >
      {isMenuOpen ? (
        <div className="mb-6 flex justify-between">
          <h2 className="title">Group stage draws:</h2>
          {menuTogglerMarkup(<ArrowLeftToLine />)}
        </div>
      ) : (
        <div className="mb-6 flex justify-between">{menuTogglerMarkup(<ArrowRightToLine />, "")}</div>
      )}
      {isMenuOpen && (
        <>
          <Button
            className="w-full py-1.5 px-4 mb-6"
            onClick={() => navigate({ to: "/groupStageDraws/new" })}
          >
            <SquarePlus className="w-6 mr-2" /> Create new
          </Button>
          <div className="flex flex-col mb-6 text-left">
            {menuItems?.map((t) => (
              <Link
                key={t.id}
                to={`/groupStageDraws/${t.id}`}
                className="py-[0.375rem] px-3 [&:not(:last-child)]:mb-2 rounded-md [&.active]:bg-[hsl(var(--accent))] [&.active]:font-medium hover:bg-[hsl(var(--accent))]"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

const SheetVariant = ({
  menuItems,
  navigate,
  className,
}: {
  menuItems: Array<TournamentDrawNameAndIdDTO>;
  navigate: UseNavigateResult<string>;
  className?: string;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const routerState = useRouterState();
  const isIndexLocation = routerState.location.pathname === "/groupStageDraws";
  const centeredContentCss = "fixed flex top-0 left-0 w-full h-full items-center";

  return (
    <div className={cn(`${isIndexLocation && centeredContentCss}`, className)}>
      <div className="p-2 flex items-center gap-6 m-auto">
        <Button variant="outline" className="py-1.5 px-4" onClick={() => setIsMenuOpen((val) => !val)}>
          Select a group stage draw
        </Button>
        <span className="font-bold text-lg">or</span>
        <Button className="py-1.5 px-4" onClick={() => navigate({ to: "/groupStageDraws/new" })}>
          <SquarePlus className="w-6 mr-2" /> Create new
        </Button>
      </div>
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="mb-4">Group stage draws:</SheetTitle>
            <SheetDescription>
              <div className="flex flex-col text-left">
                {menuItems?.map((t) => (
                  <Link
                    key={t.id}
                    to={`/groupStageDraws/${t.id}`}
                    className="py-[0.375rem] px-3 [&:not(:last-child)]:mb-2 rounded-md [&.active]:bg-[hsl(var(--accent))] [&.active]:font-medium hover:bg-[hsl(var(--accent))]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
