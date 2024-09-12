import { getTotalPointsFromXBestResults } from "@/lib/getTotalPointsFromXBestResults";
import { RankedPlayerDTO } from "../api/apiTypes";
import { tournamentDrawDefaults } from "@/config";
import { RankedPlayer } from "@/domain";

// TODO rn this function can only be used in rankings feature, not in tournament draw feature
// make it universal or move it to a correct place
export const sortPlayersByPoints = (
  data: Array<RankedPlayerDTO> | undefined,
  numberOfResultsCountedToPointsTotal: number
): Array<RankedPlayer> =>
  data
    ?.map<RankedPlayer>((player) => ({
      ...player,
      points: getTotalPointsFromXBestResults(
        player.tournamentResults,
        numberOfResultsCountedToPointsTotal ?? tournamentDrawDefaults.numberOfResultsCountedToPointsTotal
      ),
    }))
    .sort((playerA, playerB) => playerB.points - playerA.points) ?? [];
