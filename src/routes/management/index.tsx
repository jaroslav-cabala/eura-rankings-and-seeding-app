import { FC } from "react";
import { Tournament, TournamentResult } from "@/api/apiTypes";
import { useFetch } from "@/api/useFetchData";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { ColumnSimpleValueWrapper } from "@/components/features/Rankings/DataTable/dataTableCommon";
import { Badge } from "@/components/ui/badge";
import { CircleX, Import, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, getHrefToFwangoTournamentResult } from "@/utils";
import { useGetTournaments } from "../../components/features/Management/useGetTournaments";

export const Route = createFileRoute("/management/")({
  component: Management,
});

function Management() {
  console.log("Rankings data management component");
  const {
    data: dataStorage,
    loading: loadingDataStorage,
    error: errorDataStorage,
  } = useGetTournaments("http:localhost:3001/tournaments");
  const {
    data: dataFwango,
    loading: loadingDataFwango,
    error: errorDataFwango,
  } = useGetTournaments("http:localhost:3001/tournaments/from-fwango");

  if (errorDataFwango || errorDataStorage) {
    return (
      <>
        <div className="w-[1300px] mx-auto py-1">Error while fetching data</div>
      </>
    );
  }

  // compare tournaments from fwango with tournaments from the storage to find new tournaments
  // which results can be downloaded and saved
  const tableData: RankingsDataManagementTableDataRow[] =
    dataFwango?.map((tournamentFromFwango) => ({
      ...tournamentFromFwango,
      date: tournamentFromFwango.date,
      isTournamentImported: !!dataStorage?.find(
        (tournamentFromStorage) =>
          tournamentFromStorage.tournamentId === tournamentFromFwango.tournamentId &&
          tournamentFromStorage.name === tournamentFromFwango.name
      ),
    })) ?? [];

  return (
    <RankingsDataManagementComponent data={tableData} loading={loadingDataFwango || loadingDataStorage} />
  );
}

type RankingsDataManagementComponentProps = {
  data: RankingsDataManagementTableDataRow[];
  loading: boolean;
};

const RankingsDataManagementComponent: FC<RankingsDataManagementComponentProps> = ({ data, loading }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="w-[1000px] mx-auto py-1 mt-12">
      {loading ? <p>loading...</p> : <DataTable table={table} />}
    </div>
  );
};

type RankingsDataManagementTableDataRow = {
  tournamentId: string;
  date: string;
  name: string;
  isTournamentImported: boolean;
  results: TournamentResult[];
};

const columns: ColumnDef<RankingsDataManagementTableDataRow>[] = [
  {
    id: "Date",
    accessorKey: "date",
    header: ({ column }) => Header(column),
    cell: ({ row }) => {
      return <div className="font-normal">{formatDate(row.getValue("Date"))}</div>;
    },
  },
  {
    id: "Tournament",
    accessorKey: "name",
    header: ({ column }) => Header(column),
    cell: ({ row }) => {
      return <TournamentCell row={row} />;
    },
  },
  {
    id: "Status",
    accessorKey: "isTournamentImported",
    header: ({ column }) => Header(column),
    cell: ({ row }) => <StatusCell row={row} />,
  },
];

function Header<TData>(column: Column<TData, unknown>) {
  return <div className="py-1 px-0 text-xs">{column.id}</div>;
}

const TournamentCell = ({ row }: { row: Row<RankingsDataManagementTableDataRow> }) => {
  const tournamentResultLinks = row.original.results.map((result) => (
    <a
      href={getHrefToFwangoTournamentResult(result.tournamentResultId, result.category, result.division)}
      target="_blank"
      key={result.tournamentResultId}
      className="text-sm font-normal text-blue-400 hover:cursor-pointer hover:text-blue-600 hover:underline hover:underline-offset-2 p-0 h-4 mr-2"
    >
      {`${result.category} ${result.division}`}
    </a>
  ));
  return (
    <>
      <ColumnSimpleValueWrapper>{row.getValue("Tournament")}</ColumnSimpleValueWrapper>
      <div className="">{tournamentResultLinks}</div>
    </>
  );
};

const StatusCell = ({ row }: { row: Row<RankingsDataManagementTableDataRow> }) => {
  const { fetch, data, loading, error } = useFetch<boolean>();

  const importTournamentResults = (tournamentResultsRow: Row<RankingsDataManagementTableDataRow>) => {
    const tournamentResultsArg: Tournament = {
      tournamentId: tournamentResultsRow.original.tournamentId,
      name: tournamentResultsRow.original.name,
      date: tournamentResultsRow.original.date,
      results: tournamentResultsRow.original.results,
    };

    fetch(`http:localhost:3001/tournaments/import-tournament-result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([tournamentResultsArg]),
    });
  };

  const importedMarkup = (
    <Badge variant="defaultWithoutHover" className="bg-green-600 h-7 px-3">
      Imported
    </Badge>
  );
  const importButtontMarkup = (
    <Button onClick={() => importTournamentResults(row)} variant="outline" className="h-7 px-3">
      <Import className="mr-2 h-5" />
      Import
    </Button>
  );
  const loadingMarkup = (
    <div className="flex items-center">
      <Loader2 className="h-4 w-4 animate-spin mr-2" />
      <span>Importing...</span>
    </div>
  );
  const errorMarkup = (
    <div className="flex items-center">
      <CircleX className="text-red-600 mr-2" />
      <span className="text-red-600">Import failed!</span>
    </div>
  );

  const statusMarkup =
    !data && !loading && !error
      ? importButtontMarkup
      : loading
        ? loadingMarkup
        : error || data !== true
          ? errorMarkup
          : importedMarkup;

  return <>{row.getValue("Status") ? importedMarkup : statusMarkup}</>;
};
