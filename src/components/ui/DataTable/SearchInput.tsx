import { Input } from "@/components/ui/input";
import { RowData, Table } from "@tanstack/react-table";

type SearchInputProps<TData> = {
  table: Table<TData>;
  columnId: string;
  placeholder: string;
  className?: string;
};

export const SearchInput = <TData extends RowData>({
  table,
  columnId,
  placeholder,
  className,
}: SearchInputProps<TData>) => {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(columnId)?.getFilterValue() as string) ?? ""}
      onChange={(event) => table.getColumn(columnId)?.setFilterValue(event.target.value)}
      className={`${className} max-w-sm shadow-sm`}
    />
  );
};
