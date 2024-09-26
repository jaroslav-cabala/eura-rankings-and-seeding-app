import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, SquarePlus } from "lucide-react";
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

  if (error) {
    return (
      <section id="fullscreen-section">
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

  return (
    <div id="tournament-draws-menu">
      <p className="title pb-6 pt-2">Tournaments</p>
      <Button className="mb-6 py-1.5 px-4" onClick={() => navigate({ to: "/tournament-draws/new" })}>
        <SquarePlus className="w-6 mr-2" /> Create new
      </Button>
      <div className="flex flex-col mb-2 text-left">
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
    </div>
  );
};
