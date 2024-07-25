import { getTotalPointsFromXBestResults } from "../lib/getTotalPointsFromXBestResults";
import { Category } from "../domain";
import { useFetchJsonData } from "./useFetchData";
import { Player, RankedTeam, RankedTeamTournamentResult } from "../apiTypes";

// include individual tournament results as well
export type RankedTeams = Array<{
  rank: number;
  teamId: string;
  teamUid: string;
  name: string;
  playerOne: Player;
  playerTwo: Player;
  points: number;
  tournamentResults: Array<RankedTeamTournamentResult>
}>;

export type GetRankedTeamsResult = {
  data: RankedTeams;
  loading: boolean;
  error: boolean;
};

export const useGetRankedTeams = (division: Category): GetRankedTeamsResult => {
  const { data, loading, error } = useFetchJsonData<Array<RankedTeam>>(
    `http:localhost:3001/rankings/${division}/teams`
  );

  if (data && !loading && !error) {
    const rankedTeams = data.map<RankedTeams[number]>((team, index) => ({
      rank: index + 1,
      teamId: team.id,
      teamUid: team.uid,
      name: team.name,
      playerOne: team.players[0],
      playerTwo: team.players[1],
      points: getTotalPointsFromXBestResults(team.tournamentResults, 2),
      tournamentResults: team.tournamentResults
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
