import { RankedPlayer } from "../apiTypes";
import { Division } from "../domain";
import { getTotalPointsFromXBestResults } from "../lib/getTotalPointsFromXBestResults";
import { useFetchJsonData } from "./useFetchData";

// include individual tournament results as well
export type RankedPlayers = Array<{
  playerId: string;
  playerUid: string;
  name: string;
  points: number;
}>;

export type GetRankedPlayersResult = {
  data: RankedPlayers;
  loading: boolean;
  error: boolean;
};

export const useGetRankedPlayers = (division: Division): GetRankedPlayersResult => {
  const { data, loading, error } = useFetchJsonData<Array<RankedPlayer>>(
    new URL(`http:localhost:3001/rankings/${division}/players`)

  );

  if (data && !loading && !error) {
    const rankedPlayers = data.map<RankedPlayers[number]>((player) => ({
      playerId: player.id,
      playerUid: player.uid,
      name: player.name,
      points: getTotalPointsFromXBestResults(player.tournamentResults, 2),
    }));

    return {
      data: rankedPlayers,
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
