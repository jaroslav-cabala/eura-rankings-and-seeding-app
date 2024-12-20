import { FC, useState } from "react";
import { TournamentDTO, TournamentDivisionDTO } from "@/api/apiTypes";
import { useFetchLazy } from "@/api/useFetch";
import { createFileRoute } from "@tanstack/react-router";
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { ColumnSimpleValueWrapper } from "@/components/ui/DataTable/dataTableCommon";
import { Badge } from "@/components/ui/badge";
import { Import, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, getHrefToFwangoTournamentResult } from "@/utils";
import { DataTable } from "@/components/ui/DataTable/DataTable";
import { SearchInput } from "@/components/ui/DataTable/SearchInput";
import { useGetTournaments } from "@/api/useGetTournaments";
import { FullScreenError } from "@/components/common/FullScreenError";
import { useToast } from "@/components/ui/hooks/use-toast";
import { ErrorToastMessage } from "@/components/common/ErrorToastMessage";
import { SuccessToastMessage } from "@/components/common/SuccessToastMessage";

export const Route = createFileRoute("/management")({
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
      <section>
        <FullScreenError />
      </section>
    );
  }

  // compare tournaments from fwango with tournaments from the storage to find new tournaments
  // which results can be downloaded and saved
  const tableData =
    dataFwango?.map<RankingsDataManagementTableDataRow>((tournamentFromFwango) => ({
      ...tournamentFromFwango,
      isTournamentImported: !!dataStorage?.find(
        (tournamentFromStorage) =>
          tournamentFromStorage.fwangoId === tournamentFromFwango.fwangoId &&
          tournamentFromStorage.name === tournamentFromFwango.name
      ),
    })) ?? [];

  const dataIsLoading = loadingDataFwango || loadingDataStorage || !dataStorage || !dataFwango;
  return <RankingsDataManagementComponent data={tableData} loading={dataIsLoading} />;
}

type RankingsDataManagementComponentProps = {
  data: RankingsDataManagementTableDataRow[];
  loading: boolean;
};

const RankingsDataManagementComponent: FC<RankingsDataManagementComponentProps> = ({ data, loading }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <section className="p-2 pt-8 m-auto lg:min-w-[800px] lg:max-w-[1000px] lg:flex-grow">
      <div className="flex flex-wrap gap-x-2 items-center justify-between mb-2">
        <span className={`font-medium py-2 ${(loading || !table) && "invisible"}`}>
          {table.getRowCount()} tournaments
        </span>
        <SearchInput table={table} columnId="Tournament" placeholder="Search tournaments..." />
      </div>
      <DataTable table={table} loading={loading} />
    </section>
  );
};

type RankingsDataManagementTableDataRow = {
  fwangoId: string;
  date: string;
  name: string;
  isTournamentImported: boolean;
  divisions: TournamentDivisionDTO[];
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
    size: 120,
    meta: {
      customSize: true,
    },
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
        divisionResult.fwangoResultId,
        divisionResult.category,
        divisionResult.division
      )}
      target="_blank"
      key={divisionResult.fwangoResultId}
      className="text-sm p-0 h-4 font-normal text-blue-400 hover:cursor-pointer hover:text-blue-600 hover:underline hover:underline-offset-4"
    >
      {divisionResult.category.name}&nbsp;
      {divisionResult.division.name}{" "}
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
  const { fetch, data, loading, error, completed } = useFetchLazy<boolean>();
  const { toast } = useToast();

  const importTournamentResults = (tournamentResultsRow: Row<RankingsDataManagementTableDataRow>) => {
    const tournamentResultsArg: TournamentDTO = {
      fwangoId: tournamentResultsRow.original.fwangoId,
      name: tournamentResultsRow.original.name,
      date: tournamentResultsRow.original.date,
      divisions: tournamentResultsRow.original.divisions,
    };

    fetch({
      fetchUrl: `http:localhost:3001/tournaments/import-tournament-result`,
      requestInit: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tournamentResultsArg),
      },
      onSuccessAction: (response) => {
        if (response === true) {
          toast({
            description: <SuccessToastMessage>Tournament successfuly imported!</SuccessToastMessage>,
          });
        } else {
          toast({
            description: <ErrorToastMessage>An unexpected error occured. Import failed.</ErrorToastMessage>,
          });
        }
      },
      onErrorAction: () => {
        toast({
          description: <ErrorToastMessage>An unexpected error occured. Import failed.</ErrorToastMessage>,
        });
      },
    });
  };

  const importedMarkup = (
    <Badge variant="defaultWithoutHover" className="bg-green-600 h-7 px-3">
      Imported
    </Badge>
  );
  const importButtontMarkup = (
    <Button onClick={() => importTournamentResults(row)} variant="outline" className="h-7 pr-3 pl-2">
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

  const statusMarkup = loading
    ? loadingMarkup
    : data === true && completed && !error
      ? importedMarkup
      : importButtontMarkup;

  return <>{row.original.isTournamentImported ? importedMarkup : statusMarkup}</>;
};
