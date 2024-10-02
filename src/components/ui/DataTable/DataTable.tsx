import "@tanstack/react-table";
import { RowData, Table, flexRender } from "@tanstack/react-table";
import * as ShadcnTable from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Pagination } from "./Pagination";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    customSize: boolean;
  }
}

type DataTableProps<TData extends RowData> = {
  table: Table<TData>;
  loading: boolean;
};
export const DataTable = <TData extends RowData>({ table, loading }: DataTableProps<TData>) => {
  return (
    <>
      <div className="rounded-md border shadow-sm">
        <ShadcnTable.Table>
          <ShadcnTable.TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <ShadcnTable.TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <ShadcnTable.TableHead
                      key={header.id}
                      className="px-3"
                      style={{
                        width: header.column.columnDef.meta?.customSize
                          ? header.column.columnDef.size
                          : undefined,
                        maxWidth: header.column.columnDef.meta?.customSize ? "fit-content" : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </ShadcnTable.TableHead>
                  );
                })}
              </ShadcnTable.TableRow>
            ))}
          </ShadcnTable.TableHeader>
          <ShadcnTable.TableBody>
            {loading
              ? getLoadingMarkup(table.getAllColumns().length)
              : table.getRowModel().rows?.length
                ? table.getRowModel().rows.map((row) => (
                    <ShadcnTable.TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <ShadcnTable.TableCell
                          key={cell.id}
                          className="py-2 px-3"
                          style={{
                            width: cell.column.columnDef.meta?.customSize
                              ? cell.column.columnDef.size
                              : undefined,
                            maxWidth: cell.column.columnDef.meta?.customSize ? "fit-content" : undefined,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </ShadcnTable.TableCell>
                      ))}
                    </ShadcnTable.TableRow>
                  ))
                : getNoResultsMarkup(table.getAllColumns().length)}
          </ShadcnTable.TableBody>
        </ShadcnTable.Table>
      </div>
      <div className=" pt-2 mb-4 flex items-center justify-between flex-wrap gap-x-6">
        <Pagination table={table} loading={loading} className="ml-auto" />
      </div>
    </>
  );
};

const getLoadingMarkup = (columnsCount: number) => (
  <ShadcnTable.TableRow>
    <ShadcnTable.TableCell colSpan={columnsCount} className="h-36 text-center p-3">
      <div className="flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span>Loading...</span>
      </div>
    </ShadcnTable.TableCell>
  </ShadcnTable.TableRow>
);

const getNoResultsMarkup = (columnsCount: number) => (
  <ShadcnTable.TableRow>
    <ShadcnTable.TableCell colSpan={columnsCount} className="h- text-center p-3">
      No results.
    </ShadcnTable.TableCell>
  </ShadcnTable.TableRow>
);
