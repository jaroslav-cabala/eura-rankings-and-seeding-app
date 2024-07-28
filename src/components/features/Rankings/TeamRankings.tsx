import { useGetRankedTeams } from "@/hooks/useGetRankedTeams";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { UseRankingsState, useRankingsState } from "./useRankingsState";
import { DataTable } from "./DataTable/DataTable";
import { RankingsFilter } from "./RankingsFilter";
import { SortingButton, ColumnSimpleValueWrapper } from "./DataTable/dataTableCommon";
import React, { FC } from "react";
import { SearchInput } from "./DataTable/SearchInput";

export const TeamRankings = () => {
  console.log("TeamRankings component");
  const rankingsState = useRankingsState();
  const {
    data: teams,
    loading: teamsLoading,
    error: teamsError,
  } = useGetRankedTeams({
    category: rankingsState.category,
    division: rankingsState.division,
    numberOfResultsCountedToPointsTotal: rankingsState.numberOfResultsCountedToPointsTotal,
    seasons: rankingsState.seasons,
  });

  const tableData: Array<TeamRankingsTableDataRow> = teams.map((team, index) => ({
    rank: index + 1,
    team: {
      name: team.name,
      playerOneName: team.playerOne.name,
      playerTwoName: team.playerTwo.name,
    },
    points: team.points,
    tournamentsPlayed: team.tournamentResults.length,
  }));

  if (teamsError) {
    return (
      <>
        <div className="container mx-auto">Error while loading team rankings</div>
      </>
    );
  }
  return <TeamRankingsComponent data={tableData} dataLoading={teamsLoading} filterState={rankingsState} />;
};

type TeamRankingsComponentProps = {
  data: TeamRankingsTableDataRow[];
  dataLoading: boolean;
  filterState: UseRankingsState;
};
const TeamRankingsComponent: FC<TeamRankingsComponentProps> = ({ data, dataLoading, filterState }) => {
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
          <p>loading team rankings</p>
        ) : (
          <>
            <div className="flex items-center py-1">
              <SearchInput table={table} columnId="Team" placeholder="Search teams..." />
              <div className="ml-5">{table.getRowModel().rows?.length} ranked teams</div>
            </div>
            <DataTable table={table} />
          </>
        )}
      </div>
    </>
  );
};

type TeamRankingsTableDataRow = {
  rank: number;
  team: {
    name: string;
    playerOneName: string;
    playerTwoName: string;
  };
  points: number;
  tournamentsPlayed: number;
};

const columns: ColumnDef<TeamRankingsTableDataRow>[] = [
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
    id: "Team",
    accessorKey: "team.name",
    header: ({ column }) => {
      return SortingButton(column);
    },
    cell: ({ row }) => {
      return (
        <>
          <div className="text-base font-medium">{row.getValue("Team")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.team.playerOneName} / {row.original.team.playerTwoName}
          </div>
        </>
      );
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
