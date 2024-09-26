import { useGetRankedTeams } from "@/api/useGetRankedTeams";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "../../ui/dataTable";
import { RankingsFilter } from "./RankingsFilter";
import { SortingButton, ColumnSimpleValueWrapper } from "./DataTable/dataTableCommon";
import React, { FC } from "react";
import { SearchInput } from "./DataTable/SearchInput";
import { Route as TeamRankingsRoute } from "@/routes/rankings/_layout.team";
import { useSearch } from "@tanstack/react-router";
import { RankingsFilterOptions } from "./settings";
import { sortTeamsByPoints } from "@/lib/sortTeamsByPoints";

export const TeamRankings = () => {
  console.log("TeamRankings component");
  const rankingsFilterParams = useSearch({ from: TeamRankingsRoute.id });
  const {
    data: teams,
    loading: teamsLoading,
    error: teamsError,
  } = useGetRankedTeams({
    teamCategory: rankingsFilterParams.category,
    resultDivisions: [rankingsFilterParams.division],
    seasons: rankingsFilterParams.seasons,
  });

  const teamsSortedByPoints = sortTeamsByPoints(
    teams,
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
    <section className="p-2 min-w-[500px] max-w-[700px] m-auto lg:min-w-[800px] lg:max-w-[1000px] lg:flex lg:flex-row-reverse lg:justify-center lg:gap-6">
      <RankingsFilter rankingsFilterParams={rankingsFilterParams} />
      <div className="lg:flex-grow">
        {dataLoading ? (
          <p>loading team rankings</p>
        ) : (
          <>
            <div className="flex items-center justify-between py-1">
              <span className="font-medium">{table.getRowModel().rows?.length} teams</span>
              <SearchInput table={table} columnId="Team" placeholder="Search teams..." />
            </div>
            <DataTable table={table} />
          </>
        )}
      </div>
    </section>
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
    // size: 300,
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
    header: ({ column }) => SortingButton(column),
    cell: ({ row }) => {
      return <ColumnSimpleValueWrapper>{row.getValue("Points")}</ColumnSimpleValueWrapper>;
    },
  },
  {
    id: "Tournaments",
    accessorKey: "tournamentsPlayed",
    size: 80,
    header: ({ column }) => SortingButton(column),
  },
];
