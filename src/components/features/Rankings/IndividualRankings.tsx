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
import { useGetRankedPlayers } from "@/api/useGetRankedPlayers";
import { DataTable } from "../../ui/dataTable";
import { RankingsFilter } from "./RankingsFilter";
import { SortingButton, ColumnSimpleValueWrapper } from "./DataTable/dataTableCommon";
import { SearchInput } from "./DataTable/SearchInput";
import { useSearch } from "@tanstack/react-router";
import { Route as IndividualRankingsRoute } from "@/routes/rankings/_layout.individual";
import { RankingsFilterOptions } from "./settings";
import { sortPlayersByPoints } from "@/lib/sortPlayersByPoints";

export const IndividualRankings = () => {
  console.log("IndividualRankings component");
  const rankingsFilterParams = useSearch({ from: IndividualRankingsRoute.id });
  const {
    data: players,
    loading: playersLoading,
    error: playersError,
  } = useGetRankedPlayers({
    resultCategories: [rankingsFilterParams.category],
    resultDivisions: [rankingsFilterParams.division],
    seasons: rankingsFilterParams.seasons,
  });

  const playersSortedByPoints = sortPlayersByPoints(
    players,
    rankingsFilterParams.numberOfResultsCountedToPointsTotal
  );

  const tableData: Array<IndividualRankingsTableDataRow> = playersSortedByPoints.map((player, index) => ({
    rank: index + 1,
    name: player.name,
    points: player.points,
    tournamentsPlayed: player.tournamentResults.length,
  }));

  console.log(`IndividualRankings component - queryString=`, rankingsFilterParams);
  console.log(`IndividualRankings component - players=${players}, loading=${playersLoading}`);

  if (playersError) {
    return (
      <>
        <div className="container mx-auto">Error while fetching player rankings</div>
      </>
    );
  }

  return (
    <IndividualRankingsComponent
      data={tableData}
      dataLoading={playersLoading}
      rankingsFilterParams={rankingsFilterParams}
    />
  );
};

type IndividualRankingsComponentProps = {
  data: IndividualRankingsTableDataRow[];
  dataLoading: boolean;
  rankingsFilterParams: RankingsFilterOptions;
};
const IndividualRankingsComponent: FC<IndividualRankingsComponentProps> = ({
  data,
  dataLoading,
  rankingsFilterParams,
}) => {
  console.log(`IndividualRankings component - tableData=`, data);
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
          <p>loading player rankings</p>
        ) : (
          <>
            <div className="flex items-center justify-between py-1">
              <span className="font-medium">{table.getRowModel().rows?.length} players</span>
              <SearchInput table={table} columnId="Name" placeholder="Search players..." />
            </div>
            <DataTable table={table} />
          </>
        )}
      </div>
    </section>
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
    size: 60,
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
    size: 300,
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
    size: 80,
    header: ({ column }) => {
      return SortingButton(column);
    },
    cell: ({ row }) => {
      return <ColumnSimpleValueWrapper>{row.getValue("Points")}</ColumnSimpleValueWrapper>;
    },
  },
  {
    id: "Tournaments",
    accessorKey: "tournamentsPlayed",
    size: 80,
    header: ({ column }) => {
      return SortingButton(column);
    },
  },
];
