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
import { DataTable } from "../../ui/dataTable";
import { RankingsFilter } from "./RankingsFilter";
import { SortingButton, ColumnSimpleValueWrapper } from "./DataTable/dataTableCommon";
import { SearchInput } from "./DataTable/SearchInput";
import { useSearch } from "@tanstack/react-router";
import { Route as IndividualRankingsRoute } from "@/routes/rankings/_layout.individual";
import { RankingsFilterOptions } from "./settings";
import { sortPlayersByPoints } from "@/lib/sortPlayersByPoints";
import { Pagination } from "./DataTable/Pagination";

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
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{table.getRowCount()} players</span>
          <SearchInput table={table} columnId="Name" placeholder="Search players..." />
        </div>
        <DataTable table={table} loading={dataLoading} />
        <div className=" pt-2 mb-4 flex items-center gap-6">
          <Pagination table={table} />
        </div>
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
    size: 50,
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
    size: 70,
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
