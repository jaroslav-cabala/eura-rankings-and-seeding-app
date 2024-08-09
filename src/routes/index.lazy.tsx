import { FC } from "react";
import { RankedTournament } from "@/apiTypes";
import { useFetchJsonData } from "@/hooks/useFetchData";
import { createLazyFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ColumnSimpleValueWrapper } from "@/components/features/Rankings/DataTable/dataTableCommon";
import { Badge } from "@/components/ui/badge";
import { Import } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  console.log("Rankings data management component");
  const {
    data: dataStorage,
    loading: loadingDataStorage,
    error: errorDataStorage,
  } = useFetchJsonData<Array<RankedTournament>>("http:localhost:3001/ranked-tournaments");
  const {
    data: dataFwango,
    loading: loadingDataFwango,
    error: errorDataFwango,
  } = useFetchJsonData<Array<RankedTournament>>("http:localhost:3001/ranked-tournaments/from-fwango");

  if (errorDataFwango || errorDataStorage) {
    return (
      <>
        <div className="w-1/2 mx-auto py-1">Error while fetching data</div>
      </>
    );
  }

  // compare tournaments from fwango with tournaments from the storage to find new tournaments
  // which results can be downloaded and saved
  const tableData: RankingsDataManagementTableDataRow[] =
    dataFwango?.map((tournamentFromFwango) => ({
      tournamentId: tournamentFromFwango.tournamentResultId,
      date: tournamentFromFwango.date,
      name: tournamentFromFwango.name,
      isTournamentInTheSystem: !!dataStorage?.find(
        (tournamentFromStorage) =>
          tournamentFromStorage.tournamentId === tournamentFromFwango.tournamentId &&
          tournamentFromStorage.tournamentResultId === tournamentFromFwango.tournamentResultId &&
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
    <div className="w-1/2 mx-auto py-1 mt-12">
      {loading ? <p>loading...</p> : <DataTable table={table} />}
    </div>
  );
};

type RankingsDataManagementTableDataRow = {
  tournamentId: string;
  date: string;
  name: string;
  isTournamentInTheSystem: boolean;
};

const columns: ColumnDef<RankingsDataManagementTableDataRow>[] = [
  {
    id: "Date",
    accessorKey: "date",
    header: ({ column }) => Header(column),
    cell: ({ row }) => {
      return <ColumnSimpleValueWrapper>{row.getValue("Date")}</ColumnSimpleValueWrapper>;
    },
  },
  {
    id: "Tournament",
    accessorKey: "name",
    header: ({ column }) => Header(column),
    cell: ({ row }) => {
      return <ColumnSimpleValueWrapper>{row.getValue("Tournament")}</ColumnSimpleValueWrapper>;
    },
  },
  {
    id: "Status",
    accessorKey: "isTournamentInTheSystem",
    header: ({ column }) => Header(column),
    cell: ({ row }) => <StatusCell isTournamentInTheSystem={row.original.isTournamentInTheSystem} />,
  },
];

function Header<TData>(column: Column<TData, unknown>) {
  return <div className="py-1 px-0 text-xs">{column.id}</div>;
}

const StatusCell = ({ isTournamentInTheSystem }: { isTournamentInTheSystem: boolean }) => {
  return (
    <>
      {isTournamentInTheSystem ? (
        <Badge variant="defaultWithoutHover" className="bg-green-600 h-7 px-3">
          Imported
        </Badge>
      ) : (
        <Button variant="outline" className="h-7 px-3">
          <Import className="mr-2 h-5" />
          Import
        </Button>
      )}
    </>
  );
};
