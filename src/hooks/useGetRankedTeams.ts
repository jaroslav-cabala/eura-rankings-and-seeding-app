import { getTotalPointsFromXBestResults } from "../lib/getTotalPointsFromXBestResults";
import { Division } from "../domain";
import { useFetchJsonData } from "./useFetchData";
import { Player, RankedTeam } from "../apiTypes";

// include individual tournament results as well
export type RankedTeams = Array<{
  teamId: string;
  teamUid: string;
  name: string;
  playerOne: Player;
  playerTwo: Player;
  points: number;
}>;

export type GetRankedTeamsResult = {
  data: RankedTeams;
  loading: boolean;
  error: boolean;
};

export const useGetRankedTeams = (division: Division): GetRankedTeamsResult => {
  const { data, loading, error } = useFetchJsonData<Array<RankedTeam>>(
    new URL(`http:localhost:3001/rankings/${division}/teams`)
  );

  if (data && !loading && !error) {
    const rankedTeams = data.map<RankedTeams[number]>((team) => ({
      teamId: team.id,
      teamUid: team.uid,
      name: team.name,
      playerOne: team.players[0],
      playerTwo: team.players[1],
      points: getTotalPointsFromXBestResults(team.tournamentResults, 2),
    }));

    return {
      data: rankedTeams,
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
