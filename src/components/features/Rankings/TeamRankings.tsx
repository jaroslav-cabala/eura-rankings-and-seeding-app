import { useGetRankedTeams } from "@/api/useGetRankedTeams";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "../../ui/DataTable/DataTable";
import { RankingsFilter } from "./RankingsFilter";
import { SortingButton, ColumnSimpleValueWrapper } from "../../ui/DataTable/dataTableCommon";
import React, { FC } from "react";
import { Route as TeamRankingsRoute } from "@/routes/rankings/_layout.team";
import { useSearch } from "@tanstack/react-router";
import { RankingsFilterOptions } from "./settings";
import { sortTeamsByPoints } from "@/lib/sortTeamsByPoints";
import { SearchInput } from "../../ui/DataTable/SearchInput";

export const TeamRankings = () => {
  console.log("TeamRankings component");
  const rankingsFilterParams = useSearch({ from: TeamRankingsRoute.id });
  const { data, loading, error, completed } = useGetRankedTeams({
    teamCategory: rankingsFilterParams.category,
    resultDivisions: [rankingsFilterParams.division],
    seasons: rankingsFilterParams.seasons,
  });

  const teamsSortedByPoints = sortTeamsByPoints(
    data,
    rankingsFilterParams.numberOfResultsCountedToPointsTotal
  );

  const tableData: Array<TeamRankingsTableDataRow> = teamsSortedByPoints.map((team, index) => ({
    rank: index + 1,
    team: {
      name: team.name,
      playerOneName: team.players[0].name,
      playerTwoName: team.players[1].name,
    },
    points: team.points,
    tournamentsPlayed: team.tournamentResults.length,
  }));

  if (error) {
    return (
      <>
        <div className="w-1/2 container mx-auto py-1">Error while loading team rankings</div>
      </>
    );
  }
  return (
    <TeamRankingsComponent
      data={tableData}
      dataLoading={loading || !completed}
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
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  return (
    <div className="lg:flex lg:flex-row-reverse lg:justify-center lg:gap-6">
      <RankingsFilter rankingsFilterParams={rankingsFilterParams} />
      <div className="mt-6 lg:flex-grow lg:mt-0">
        <div className="flex flex-wrap items-center justify-between mb-2">
          {!dataLoading && table && <span className="font-medium py-2">{table.getRowCount()} teams</span>}
          <SearchInput table={table} columnId="Team" placeholder="Search teams..." className="ml-auto" />
        </div>
        <DataTable table={table} loading={dataLoading} />
      </div>
    </div>
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
    size: 60,
    meta: {
      customSize: true,
    },
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
    size: 300,
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
    size: 80,
    meta: {
      customSize: true,
    },
    header: ({ column }) => SortingButton(column),
    cell: ({ row }) => {
      return <ColumnSimpleValueWrapper>{row.getValue("Points")}</ColumnSimpleValueWrapper>;
    },
  },
  {
    id: "Tournaments",
    accessorKey: "tournamentsPlayed",
    size: 80,
    meta: {
      customSize: true,
    },
    header: ({ column }) => SortingButton(column),
  },
];
