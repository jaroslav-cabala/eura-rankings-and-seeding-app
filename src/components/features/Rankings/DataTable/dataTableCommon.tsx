import { FC, PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const SortingButton = <TData,>(column: Column<TData, unknown>) => {
  return (
    <Button
      className="py-1 px-0 text-sm"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {column.id}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const ColumnSimpleValueWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className="text-base font-medium">{children}</div>;
};
