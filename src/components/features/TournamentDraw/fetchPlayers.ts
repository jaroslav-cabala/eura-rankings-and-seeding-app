import { RankedPlayerTournamentResult, RankedPlayer } from "@/api/apiTypes";
import { createQueryString } from "@/api/createQueryStringsContainingFilters";
import { tournamentDrawDefaults } from "@/config";
import { Division, Category } from "@/domain";
import { getTotalPointsFromXBestResults } from "@/lib/getTotalPointsFromXBestResults";

export type RankedPlayers = Array<{
  playerId: string;
  playerUid: string;
  name: string;
  points: number;
  tournamentResults: Array<RankedPlayerTournamentResult>;
}>;

export const fetchPlayers = async () => {
  const queryStringPlayers = createQueryString(Division.Pro, { from: "2024", to: "2024" });
  const fetchResultPlayers = await fetch(
    new URL(`http:localhost:3001/rankings/${Category.Open}/players?${queryStringPlayers}`)
  );
  const rankedPlayers: Array<RankedPlayer> = await fetchResultPlayers.json();
  return sortPlayers(rankedPlayers, tournamentDrawDefaults.numberOfResultsCountedToPointsTotal);
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
