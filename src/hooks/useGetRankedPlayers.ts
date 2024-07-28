import { TimePeriod } from "@/utils";
import { RankedPlayer, RankedPlayerTournamentResult } from "../apiTypes";
import { Category, Division } from "../domain";
import { getTotalPointsFromXBestResults } from "../lib/getTotalPointsFromXBestResults";
import { useFetchJsonData } from "./useFetchData";
import { createQueryString } from "./createQueryStringsContainingFilters";

export type RankedPlayers = Array<{
  playerId: string;
  playerUid: string;
  name: string;
  points: number;
  tournamentResults: Array<RankedPlayerTournamentResult>;
}>;

export type GetRankedPlayersResult = {
  data: RankedPlayers;
  loading: boolean;
  error: boolean;
};

type UseGetRankedPlayersProps = {
  category: Category;
  division: Division;
  seasons: TimePeriod;
  numberOfResultsCountedToPointsTotal: number;
};

export const useGetRankedPlayers = ({
  category,
  division,
  numberOfResultsCountedToPointsTotal,
  seasons,
}: UseGetRankedPlayersProps): GetRankedPlayersResult => {
  console.log(`useGetRankedPlayers hook, category=${category},division=${division},
    numberOfResultsCountedToPointsTotal=${numberOfResultsCountedToPointsTotal},
    seasons={from=${seasons.from},to=${seasons.to}}`);
  const queryString = createQueryString(division, seasons);
  const { data, loading, error } = useFetchJsonData<Array<RankedPlayer>>(
    `http:localhost:3001/rankings/${category}/players?${queryString}`
  );

  if (data && !loading && !error) {
    const rankedPlayersUnsorted = data.map<RankedPlayers[number]>((player) => ({
      playerId: player.id,
      playerUid: player.uid,
      name: player.name,
      points: getTotalPointsFromXBestResults(player.tournamentResults, numberOfResultsCountedToPointsTotal),
      tournamentResults: player.tournamentResults,
    }));

    const rankedPlayersSorted = rankedPlayersUnsorted.sort((playerA, playerB) => playerB.points - playerA.points)

    return {
      data: rankedPlayersSorted,
      loading,
      error,
    };
  }

  return {
    data: [],
    loading,
    error,
  };
};
