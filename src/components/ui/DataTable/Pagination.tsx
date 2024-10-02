import { Button } from "@/components/ui/button";
import { RowData, Table } from "@tanstack/react-table";
import { ChevronsLeft, ChevronLeftIcon, ChevronRightIcon, ChevronsRight } from "lucide-react";

type PaginationProps<TData> = {
  table: Table<TData>;
  loading: boolean;
  className: string;
};
export const Pagination = <TData extends RowData>({ table, loading, className }: PaginationProps<TData>) => {
  return (
    <>
      {!loading && (
        <div className="font-medium py-2">
          Page {table.getPageCount() ? table.getState().pagination.pageIndex + 1 : 0} of{" "}
          {table.getPageCount()}
        </div>
      )}
      <div className={`${className} flex items-center gap-1`}>
        <Button
          variant="outline"
          className="shadow-sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4 mr-2" />
          First
        </Button>
        <Button
          variant="outline"
          className="shadow-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          variant="outline"
          className="shadow-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          Next
          <ChevronRightIcon className="h-4 w-4 ml-2" />
        </Button>
        <Button
          variant="outline"
          className="shadow-sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          Last
          <ChevronsRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </>
  );
};
