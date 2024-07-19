import { useGetRankedPlayers } from "@/hooks/useGetRankedPlayers";
import { DataTable } from "./DataTable";
import { Division } from "@/domain";
import { PlayerRankingsTableDataRow, columns } from "./Columns";

export const PlayerRankings = () => {
  console.log("PlayerRankings component");
  const { data: players, loading: playersLoading, error: playersError } = useGetRankedPlayers(Division.Open);

  const tableData: Array<PlayerRankingsTableDataRow> = players.map((player) => ({
    rank: player.rank,
    name: player.name,
    points: player.points,
    tournamentsPlayed: player.tournamentResults.length,
  }));

  if (playersError) {
    return (
      <main>
        <div className="container mx-auto py-10">Error while loading player rankings</div>
      </main>
    );
  }

  return (
    <main>
      <div className="container mx-auto py-10">
        {playersLoading ? (
          <p>loading open player rankings</p>
        ) : (
          <>
            <p className="title">Open Individual {players.length}</p>
            <DataTable columns={columns} data={tableData} />
          </>
        )}
      </div>
    </main>
  );
};
