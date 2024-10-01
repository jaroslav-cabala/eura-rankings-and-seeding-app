import { FC } from "react";
import { TournamentDTO, TournamentDivisionDTO } from "@/api/apiTypes";
import { useFetchLazy } from "@/api/useFetch";
import { createFileRoute } from "@tanstack/react-router";
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
import { useGetTournaments } from "../../api/useGetTournaments";
import { DataTable } from "@/components/ui/dataTable";

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
      <section id="fullscreen-section">
        <div className="loading-screen-wrapper">
          <div className="flex m-auto">Unexpected error.</div>
        </div>
      </section>
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
    <section className="p-2 pt-4 min-w-[400px] m-auto lg:min-w-[800px] lg:max-w-[1000px]">
      <DataTable table={table} loading={loading} />
    </section>
  );
};

type RankingsDataManagementTableDataRow = {
  tournamentId: string;
  date: string;
  name: string;
  isTournamentImported: boolean;
  divisions: TournamentDivisionDTO[];
};

const columns: ColumnDef<RankingsDataManagementTableDataRow>[] = [
  {
    id: "Date",
    accessorKey: "date",
    size: 80,
    header: ({ column }) => Header(column),
    cell: ({ row }) => {
      return <div className="font-normal">{formatDate(row.getValue("Date"))}</div>;
    },
  },
  {
    id: "Tournament",
    accessorKey: "name",
    size: 200,
    header: ({ column }) => Header(column),
    cell: ({ row }) => {
      return <TournamentCell row={row} />;
    },
  },
  {
    id: "Status",
    accessorKey: "isTournamentImported",
    size: 60,
    header: ({ column }) => Header(column),
    cell: ({ row }) => <StatusCell row={row} />,
  },
];

function Header<TData>(column: Column<TData, unknown>) {
  return <div className="py-1 px-0">{column.id}</div>;
}

const TournamentCell = ({ row }: { row: Row<RankingsDataManagementTableDataRow> }) => {
  const tournamentResultLinks = row.original.divisions.map((divisionResult) => (
    <a
      href={getHrefToFwangoTournamentResult(
        divisionResult.tournamentResultId,
        divisionResult.category,
        divisionResult.division
      )}
      target="_blank"
      key={divisionResult.tournamentResultId}
      className="text-sm p-0 h-4 font-normal text-blue-400 hover:cursor-pointer hover:text-blue-600 hover:underline hover:underline-offset-4"
    >
      {divisionResult.category}&nbsp;
      {divisionResult.division}{" "}
    </a>
  ));
  return (
    <>
      <ColumnSimpleValueWrapper>{row.getValue("Tournament")}</ColumnSimpleValueWrapper>
      <span>{tournamentResultLinks}</span>
    </>
  );
};

const StatusCell = ({ row }: { row: Row<RankingsDataManagementTableDataRow> }) => {
  const { fetch, data, loading, error } = useFetchLazy<boolean>();

  const importTournamentResults = (tournamentResultsRow: Row<RankingsDataManagementTableDataRow>) => {
    const tournamentResultsArg: TournamentDTO = {
      tournamentId: tournamentResultsRow.original.tournamentId,
      name: tournamentResultsRow.original.name,
      date: tournamentResultsRow.original.date,
      divisions: tournamentResultsRow.original.divisions,
    };

    // TODO think about this function. Async operation is executed here but we are not waiting for the result...
    // what about errors ?
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

  return <>{row.original.isTournamentImported ? importedMarkup : statusMarkup}</>;
};
