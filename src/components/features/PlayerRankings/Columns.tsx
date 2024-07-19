import { Button } from "@/components/ui/button";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type PlayerRankingsTableDataRow = {
  rank: number;
  name: string;
  points: number;
  tournamentsPlayed: number;
};

export const columns: ColumnDef<PlayerRankingsTableDataRow>[] = [
  {
    id: "Rank",
    accessorKey: "rank",
    header: ({ column }) => {
      return SortingButton(column);
    },
  },
  {
    id: "Name",
    accessorKey: "name",
    header: ({ column }) => {
      return SortingButton(column);
    },
  },
  {
    id: "Points",
    accessorKey: "points",
    header: ({ column }) => {
      return SortingButton(column);
    },
  },
  {
    id: "Tournaments Played",
    accessorKey: "tournamentsPlayed",
    header: ({ column }) => {
      return SortingButton(column);
    },
  },
];

const SortingButton = (column: Column<PlayerRankingsTableDataRow, unknown>) => {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {column.id}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};
