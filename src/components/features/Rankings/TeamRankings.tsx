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
import { DataTable } from "../../ui/DataTable";
import { RankingsFilter } from "./RankingsFilter";
import { SortingButton, ColumnSimpleValueWrapper } from "./DataTable/dataTableCommon";
import React, { FC } from "react";
import { SearchInput } from "./DataTable/SearchInput";
import { Route as TeamRankingsRoute } from "@/routes/rankings/_layout.team";
import { useSearch } from "@tanstack/react-router";
import { RankingsFilterOptions } from "./settings";

export const TeamRankings = () => {
  console.log("TeamRankings component");
  const rankingsFilterParams = useSearch({ from: TeamRankingsRoute.id });
  const {
    data: teams,
    loading: teamsLoading,
    error: teamsError,
  } = useGetRankedTeams({
    category: rankingsFilterParams.category,
    division: rankingsFilterParams.division,
    numberOfResultsCountedToPointsTotal: rankingsFilterParams.numberOfResultsCountedToPointsTotal,
    seasons: rankingsFilterParams.seasons,
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
        <div className="w-1/2 container mx-auto py-1">Error while loading team rankings</div>
      </>
    );
  }
  return (
    <TeamRankingsComponent
      data={tableData}
      dataLoading={teamsLoading}
      rankingsFilterParams={rankingsFilterParams}
    />
  );
};

type TeamRankingsComponentProps = {
  data: TeamRankingsTableDataRow[];
  dataLoading: boolean;
  rankingsFilterParams: RankingsFilterOptions;
};
const TeamRankingsComponent: FC<TeamRankingsComponentProps> = ({
  data,
  dataLoading,
  rankingsFilterParams,
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
      <RankingsFilter rankingsFilterParams={rankingsFilterParams} />
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
    header: ({ column }) => SortingButton(column),
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
    header: ({ column }) => SortingButton(column),
    cell: ({ row }) => {
      return <ColumnSimpleValueWrapper>{row.getValue("Points")}</ColumnSimpleValueWrapper>;
    },
  },
  {
    id: "Tournaments Played",
    accessorKey: "tournamentsPlayed",
    header: ({ column }) => SortingButton(column),
  },
];
