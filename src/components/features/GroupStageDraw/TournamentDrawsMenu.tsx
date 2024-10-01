import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftToLine, ArrowRightToLine, Loader2, SquarePlus } from "lucide-react";
import { useGetTournamentDraws } from "@/api/useGetTournamentDraws";
import { Link, useNavigate } from "@tanstack/react-router";

type TournamentDrawsMenuProps = {
  selectedTournamentDrawName: string;
  selectedTournamentDrawId: string;
};

export const TournamentDrawsMenu: FC<TournamentDrawsMenuProps> = ({
  selectedTournamentDrawName,
  selectedTournamentDrawId,
}) => {
  const { data, loading, error } = useGetTournamentDraws();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);

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

  const tournamentDrawsSortedByModifiedDateDescending = [...data].sort((a, b) => b.modified - a.modified);

  const menuTogglerMarkup = (icon: React.JSX.Element) => (
    <Button
      variant="icon"
      size="icon"
      className="col-start-3 col-end-4 justify-self-end hover:bg-[hsl(var(--accent))]"
      onClick={() => setIsOpen((val) => !val)}
    >
      {icon}
    </Button>
  );

  return (
    <div className={`flex-grow p-2 pr-0 text-center ${isOpen ? "min-w-[280px]" : "w-auto flex-grow-0"}`}>
      {isOpen ? (
        <div className="mb-6 grid grid-cols-[1fr_max-content_1fr] grid-rows-1 items-center">
          <h2 className="title py-1 px-4 col-start-2 col-end-3">Tournaments</h2>
          {menuTogglerMarkup(<ArrowLeftToLine />)}
        </div>
      ) : (
        menuTogglerMarkup(<ArrowRightToLine />)
      )}
      {isOpen && (
        <>
          <div className="flex flex-col mb-6 text-left">
            {tournamentDrawsSortedByModifiedDateDescending?.map((t) => (
              <Link
                key={t.id}
                to={`/tournament-draws/${t.id}`}
                className="py-[0.375rem] px-3 [&:not(:last-child)]:mb-2 rounded-md [&.active]:bg-[hsl(var(--accent))] [&.active]:font-medium hover:bg-[hsl(var(--accent))]"
              >
                {selectedTournamentDrawId === t.id ? selectedTournamentDrawName : t.name}
              </Link>
            ))}
          </div>
          <Button className="mb-6 py-1.5 px-4" onClick={() => navigate({ to: "/tournament-draws/new" })}>
            <SquarePlus className="w-6 mr-2" /> Create new
          </Button>
        </>
      )}
    </div>
  );
};
