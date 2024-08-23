import { useEffect } from "react";
import { TimePeriod } from "@/utils";
import { RankedPlayer, RankedPlayerTournamentResult } from "./apiTypes";
import { Category, Division } from "../domain";
import { getTotalPointsFromXBestResults } from "../lib/getTotalPointsFromXBestResults";
import { useFetch } from "./useFetchData";
import { createQueryString } from "./createQueryStringsContainingFilters";
import { tournamentDrawDefaults } from "@/config";

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
  numberOfResultsCountedToPointsTotal?: number;
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

  const { fetch, data, loading, error } = useFetch<Array<RankedPlayer>>();

  useEffect(() => {
    const queryString = createQueryString(division, seasons);
    fetch(`http:localhost:3001/rankings/${category}/players?${queryString}`);
  }, [category, division, seasons, fetch]);

  return {
    data: sortPlayers(
      data,
      numberOfResultsCountedToPointsTotal ?? tournamentDrawDefaults.numberOfResultsCountedToPointsTotal
    ),
    loading,
    error,
  };
};

const sortPlayers = (
  data: Array<RankedPlayer> | undefined,
  numberOfResultsCountedToPointsTotal: number
): RankedPlayers =>
  data
    ?.map<RankedPlayers[number]>((player) => ({
      playerId: player.id,
      playerUid: player.uid,
      name: player.name,
      points: getTotalPointsFromXBestResults(
        player.tournamentResults,
        numberOfResultsCountedToPointsTotal ?? tournamentDrawDefaults.numberOfResultsCountedToPointsTotal
      ),
      tournamentResults: player.tournamentResults,
    }))
    .sort((playerA, playerB) => playerB.points - playerA.points) ?? [];
