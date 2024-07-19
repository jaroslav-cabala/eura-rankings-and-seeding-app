import { RankedPlayer, RankedPlayerTournamentResult } from "../apiTypes";
import { Division } from "../domain";
import { getTotalPointsFromXBestResults } from "../lib/getTotalPointsFromXBestResults";
import { useFetchJsonData } from "./useFetchData";

export type RankedPlayers = Array<{
  rank: number; //either compute rank on the server or on the client, for now, players are already ranked from first to last
  playerId: string;
  playerUid: string;
  name: string;
  points: number;
  tournamentResults: Array<RankedPlayerTournamentResult>
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
    const rankedPlayers = data.map<RankedPlayers[number]>((player, index) => ({
      rank: index + 1,
      playerId: player.id,
      playerUid: player.uid,
      name: player.name,
      points: getTotalPointsFromXBestResults(player.tournamentResults, 2),
      tournamentResults: player.tournamentResults
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
