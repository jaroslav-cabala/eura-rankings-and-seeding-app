import React, { FC } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useGetRankedPlayers } from "@/hooks/useGetRankedPlayers";
import { UseRankingsState, useRankingsState } from "./useRankingsState";
import { DataTable } from "./DataTable/DataTable";
import { RankingsFilter } from "./RankingsFilter";
import { SortingButton, ColumnSimpleValueWrapper } from "./DataTable/dataTableCommon";
import { SearchInput } from "./DataTable/SearchInput";

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
    <IndividualRankingsComponent data={tableData} dataLoading={playersLoading} filterState={rankingsState} />
  );
};

type IndividualRankingsComponentProps = {
  data: IndividualRankingsTableDataRow[];
  dataLoading: boolean;
  filterState: UseRankingsState;
};
const IndividualRankingsComponent: FC<IndividualRankingsComponentProps> = ({
  data,
  dataLoading,
  filterState,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  return (
    <>
      <RankingsFilter rankingsFilterState={filterState} />
      <div className="w-1/2 mx-auto py-1">
        {dataLoading ? (
          <p>loading player rankings</p>
        ) : (
          <>
            <div className="flex items-center py-1">
              <SearchInput table={table} columnId="Name" placeholder="Search players..." />
              <div className="ml-5">{table.getRowModel().rows?.length} ranked players</div>
            </div>
            <DataTable table={table} />
          </>
        )}
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
