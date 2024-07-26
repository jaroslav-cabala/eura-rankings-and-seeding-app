import { Input } from "@/components/ui/input";
import { RowData, Table } from "@tanstack/react-table";

type SearchInputProps<TData> = {
  table: Table<TData>;
  columnId: string;
  placeholder: string;
};

export const SearchInput = <TData extends RowData>({
  table,
  columnId,
  placeholder,
}: SearchInputProps<TData>) => {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(columnId)?.getFilterValue() as string) ?? ""}
      onChange={(event) => table.getColumn(columnId)?.setFilterValue(event.target.value)}
      className="max-w-sm"
    />
  );
};
