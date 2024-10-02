import React, { FC } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useGetRankedPlayers } from "@/api/useGetRankedPlayers";
import { DataTable } from "../../ui/DataTable/DataTable";
import { RankingsFilter } from "./RankingsFilter";
import { SortingButton, ColumnSimpleValueWrapper } from "../../ui/DataTable/dataTableCommon";
import { useSearch } from "@tanstack/react-router";
import { Route as IndividualRankingsRoute } from "@/routes/rankings/_layout.individual";
import { RankingsFilterOptions } from "./settings";
import { sortPlayersByPoints } from "@/lib/sortPlayersByPoints";
import { SearchInput } from "../../ui/DataTable/SearchInput";

export const IndividualRankings = () => {
  console.log("IndividualRankings component");
  const rankingsFilterParams = useSearch({ from: IndividualRankingsRoute.id });
  const { data, loading, error, completed } = useGetRankedPlayers({
    resultCategories: [rankingsFilterParams.category],
    resultDivisions: [rankingsFilterParams.division],
    seasons: rankingsFilterParams.seasons,
  });

  const playersSortedByPoints = sortPlayersByPoints(
    data,
    rankingsFilterParams.numberOfResultsCountedToPointsTotal
  );

  const tableData: Array<IndividualRankingsTableDataRow> = playersSortedByPoints.map((player, index) => ({
    rank: index + 1,
    name: player.name,
    points: player.points,
    tournamentsPlayed: player.tournamentResults.length,
  }));

  if (error) {
    return (
      <>
        <div className="container mx-auto">Error while fetching player rankings</div>
      </>
    );
  }

  return (
    <IndividualRankingsComponent
      data={tableData}
      dataLoading={loading || !completed}
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
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });
  return (
    <div className="lg:flex lg:flex-row-reverse lg:justify-center lg:gap-6">
      <RankingsFilter rankingsFilterParams={rankingsFilterParams} />
      <div className="mt-6 lg:flex-grow lg:mt-0">
        <div className="flex flex-wrap items-center justify-between mb-2">
          {!dataLoading && table && <span className="font-medium py-2">{table.getRowCount()} teams</span>}
          <SearchInput table={table} columnId="Name" placeholder="Search players..." className="ml-auto" />
        </div>
        <DataTable table={table} loading={dataLoading} />
      </div>
    </div>
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
    size: 80,
    meta: {
      customSize: true,
    },
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
    meta: {
      customSize: true,
    },
    header: ({ column }) => {
      return SortingButton(column);
    },
  },
];
