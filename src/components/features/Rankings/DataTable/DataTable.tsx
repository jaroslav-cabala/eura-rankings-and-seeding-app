import { RowData, Table, flexRender } from "@tanstack/react-table";
import * as ShadcnTable from "@/components/ui/table";

type DataTableProps<TData extends RowData> = {
  table: Table<TData>;
  // columns: ColumnDef<TData>[];
};
export const DataTable = <TData extends RowData>({ table }: DataTableProps<TData>) => {
  console.log("DataTable component");

  return (
    <div className="rounded-md border">
      <ShadcnTable.Table>
        <ShadcnTable.TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <ShadcnTable.TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <ShadcnTable.TableHead key={header.id} className="px-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </ShadcnTable.TableHead>
                );
              })}
            </ShadcnTable.TableRow>
          ))}
        </ShadcnTable.TableHeader>
        {/* TODO show loading message when data are being loaded */}
        <ShadcnTable.TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <ShadcnTable.TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <ShadcnTable.TableCell key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </ShadcnTable.TableCell>
                ))}
              </ShadcnTable.TableRow>
            ))
          ) : (
            // <ShadcnTable.TableRow>
            //   <ShadcnTable.TableCell colSpan={columns.length} className="h-24 text-center p-3">
            //     No results.
            //   </ShadcnTable.TableCell>
            // </ShadcnTable.TableRow>
            <ShadcnTable.TableRow>
              <ShadcnTable.TableCell className="h-24 text-center p-3">No results.</ShadcnTable.TableCell>
            </ShadcnTable.TableRow>
          )}
        </ShadcnTable.TableBody>
      </ShadcnTable.Table>
    </div>
  );
};
