import { RankedPlayerTournamentResultDTO, RankedPlayerDTO } from "@/api/apiTypes";
import { createQueryString } from "@/api/createQueryStringsContainingFilters";
import { Division, Category } from "@/domain";

export type RankedPlayers = Array<{
  playerId: string;
  playerUid: string;
  name: string;
  points: number;
  tournamentResults: Array<RankedPlayerTournamentResultDTO>;
}>;

export const fetchPlayers = async (): Promise<Array<RankedPlayerDTO>> => {
  const queryStringPlayers = createQueryString(Division.Pro, { from: "2024", to: "2024" });
  const fetchResultPlayers = await fetch(
    new URL(`http:localhost:3001/rankings/${Category.Open}/players?${queryStringPlayers}`)
  );

  return fetchResultPlayers.json();
  // const rankedPlayers: Array<RankedPlayerDTO> = await fetchResultPlayers.json();
  // return sortPlayers(rankedPlayers, tournamentDrawDefaults.numberOfResultsCountedToPointsTotal);
};
// const sortPlayers = (
//   data: Array<RankedPlayerDTO> | undefined,
//   numberOfResultsCountedToPointsTotal: number
// ): RankedPlayers =>
//   data
//     ?.map<RankedPlayers[number]>((player) => ({
//       playerId: player.id,
//       playerUid: player.uid,
//       name: player.name,
//       points: getTotalPointsFromXBestResults(
//         player.tournamentResults,
//         numberOfResultsCountedToPointsTotal ?? tournamentDrawDefaults.numberOfResultsCountedToPointsTotal
//       ),
//       tournamentResults: player.tournamentResults,
//     }))
//     .sort((playerA, playerB) => playerB.points - playerA.points) ?? [];
