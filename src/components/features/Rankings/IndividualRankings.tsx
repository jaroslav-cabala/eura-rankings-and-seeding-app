import { ColumnDef } from "@tanstack/react-table";
import { useGetRankedPlayers } from "@/hooks/useGetRankedPlayers";
import { useRankingsState } from "./useRankingsState";
import { DataTable } from "./DataTable";
import { RankingsFilter } from "./RankingsFilter";
import { SortingButton, ColumnSimpleValueWrapper } from "./dataTableCommon";

export const IndividualRankings = () => {
  console.log("IndividualRankings component");
  const rankingsState = useRankingsState();
  const {
    data: players,
    loading: playersLoading,
    error: playersError,
  } = useGetRankedPlayers(rankingsState.category);

  const tableData: Array<IndividualRankingsTableDataRow> = players.map((player) => ({
    rank: player.rank,
    name: player.name,
    points: player.points,
    tournamentsPlayed: player.tournamentResults.length,
  }));

  if (playersError) {
    return (
      <>
        <div className="container mx-auto">Error while loading player rankings</div>
      </>
    );
  }
  return (
    <>
      <RankingsFilter rankingsFilterState={rankingsState} />
      <div className="w-1/2 mx-auto py-1">
        {playersLoading ? <p>loading player rankings</p> : <DataTable columns={columns} data={tableData} />}
      </div>
    </>
  );
};

type IndividualRankingsTableDataRow = {
  rank: number;
  name: string;
  points: number;
  tournamentsPlayed: number;
};

const columns: ColumnDef<IndividualRankingsTableDataRow>[] = [
  {
    id: "Rank",
    accessorKey: "rank",
    header: ({ column }) => {
      return SortingButton(column);
    },
    cell: ({ row }) => {
      return <ColumnSimpleValueWrapper>{row.getValue("Rank")}</ColumnSimpleValueWrapper>;
    },
  },
  {
    id: "Name",
    accessorKey: "name",
    header: ({ column }) => {
      return SortingButton(column);
    },
    cell: ({ row }) => {
      return <ColumnSimpleValueWrapper>{row.getValue("Name")}</ColumnSimpleValueWrapper>;
    },
  },
  {
    id: "Points",
    accessorKey: "points",
    header: ({ column }) => {
      return SortingButton(column);
    },
    cell: ({ row }) => {
      return <ColumnSimpleValueWrapper>{row.getValue("Points")}</ColumnSimpleValueWrapper>;
    },
  },
  {
    id: "Tournaments Played",
    accessorKey: "tournamentsPlayed",
    header: ({ column }) => {
      return SortingButton(column);
    },
  },
];
