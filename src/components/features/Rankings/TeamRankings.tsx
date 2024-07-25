import { useGetRankedTeams } from "@/hooks/useGetRankedTeams";
import { ColumnDef } from "@tanstack/react-table";
import { useRankingsState } from "./useRankingsState";
import { DataTable } from "./DataTable";
import { RankingsFilter } from "./RankingsFilter";
import { SortingButton, ColumnSimpleValueWrapper } from "./dataTableCommon";

export const TeamRankings = () => {
  console.log("TeamRankings component");
  const rankingsState = useRankingsState();
  const { data: teams, loading: teamsLoading, error: teamsError } = useGetRankedTeams(rankingsState.category);

  const tableData: Array<TeamRankingsTableDataRow> = teams.map((team) => ({
    rank: team.rank,
    team: {
      name: team.name,
      playerOneName: team.playerOne.name,
      playerTwoName: team.playerTwo.name,
    },
    points: team.points,
    tournamentsPlayed: team.tournamentResults.length,
  }));

  if (teamsError) {
    return (
      <>
        <div className="container mx-auto">Error while loading team rankings</div>
      </>
    );
  }
  return (
    <>
      <RankingsFilter rankingsFilterState={rankingsState} />
      <div className="w-1/2 mx-auto py-1">
        {teamsLoading ? <p>loading team rankings</p> : <DataTable columns={columns} data={tableData} />}
      </div>
    </>
  );
};

type TeamRankingsTableDataRow = {
  rank: number;
  team: {
    name: string;
    playerOneName: string;
    playerTwoName: string;
  };
  points: number;
  // tournamentsPlayed: number;
};

const columns: ColumnDef<TeamRankingsTableDataRow>[] = [
  {
    id: "Rank",
    accessorKey: "rank",
    header: ({ column }) => {
      return SortingButton(column);
    },
    cell: ({ row }) => {
      return <ColumnSimpleValueWrapper>{row.getValue("Rank")}</ColumnSimpleValueWrapper>;
    },
  },
  {
    id: "Team",
    accessorKey: "team.name",
    header: ({ column }) => {
      return SortingButton(column);
    },
    cell: ({ row }) => {
      return (
        <>
          <div className="text-base font-medium">{row.getValue("Team")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.team.playerOneName}/{row.original.team.playerTwoName}
          </div>
        </>
      );
    },
  },
  {
    id: "Points",
    accessorKey: "points",
    header: ({ column }) => {
      return SortingButton(column);
    },
    cell: ({ row }) => {
      return <ColumnSimpleValueWrapper>{row.getValue("Points")}</ColumnSimpleValueWrapper>;
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
