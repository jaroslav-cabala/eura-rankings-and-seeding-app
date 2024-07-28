import { getTotalPointsFromXBestResults } from "../lib/getTotalPointsFromXBestResults";
import { Category, Division } from "../domain";
import { useFetchJsonData } from "./useFetchData";
import { Player, RankedTeam, RankedTeamTournamentResult } from "../apiTypes";
import { TimePeriod } from "@/utils";
import { createQueryString } from "./createQueryStringsContainingFilters";

export type RankedTeams = Array<{
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

type UseGetRankedTeamsProps = {
  category: Category;
  division: Division;
  seasons: TimePeriod;
  numberOfResultsCountedToPointsTotal: number;
};

export const useGetRankedTeams = ({
  category,
  division,
  numberOfResultsCountedToPointsTotal,
  seasons, }: UseGetRankedTeamsProps): GetRankedTeamsResult => {
  console.log(`useGetRankedTeams hook, category=${category},division=${division},
    numberOfResultsCountedToPointsTotal=${numberOfResultsCountedToPointsTotal},
    seasons={from=${seasons.from},to=${seasons.to}}`);
  const queryString = createQueryString(division, seasons);
  const { data, loading, error } = useFetchJsonData<Array<RankedTeam>>(
    `http:localhost:3001/rankings/${category}/teams?${queryString}`
  );

  if (data && !loading && !error) {
    const rankedTeamsUnsorted = data.map<RankedTeams[number]>((team) => ({
      teamId: team.id,
      teamUid: team.uid,
      name: team.name,
      playerOne: team.players[0],
      playerTwo: team.players[1],
      points: getTotalPointsFromXBestResults(team.tournamentResults, numberOfResultsCountedToPointsTotal),
      tournamentResults: team.tournamentResults
    }));

    const rankedTeamsSorted = rankedTeamsUnsorted.sort((teamA, teamB) => teamB.points - teamA.points)

    return {
      data: rankedTeamsSorted,
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
