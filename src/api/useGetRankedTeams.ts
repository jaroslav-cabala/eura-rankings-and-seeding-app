import { useEffect } from "react";
import { getTotalPointsFromXBestResults } from "../lib/getTotalPointsFromXBestResults";
import { Category, Division } from "../domain";
import { useFetch } from "./useFetchData";
import { Player, RankedTeam, RankedTeamTournamentResult } from "./apiTypes";
import { TimePeriod } from "@/utils";
import { createQueryString } from "./createQueryStringsContainingFilters";
import { tournamentDrawDefaults } from "@/config";

export type RankedTeams = Array<{
  teamId: string;
  teamUid: string;
  name: string;
  playerOne: Player;
  playerTwo: Player;
  points: number;
  tournamentResults: Array<RankedTeamTournamentResult>;
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
  seasons,
}: UseGetRankedTeamsProps): GetRankedTeamsResult => {
  console.log(`useGetRankedTeams hook, category=${category},division=${division},
    numberOfResultsCountedToPointsTotal=${numberOfResultsCountedToPointsTotal},
    seasons={from=${seasons.from},to=${seasons.to}}`);
  const { fetch, data, loading, error } = useFetch<Array<RankedTeam>>();

  useEffect(() => {
    const queryString = createQueryString(division, seasons);
    fetch(`http:localhost:3001/rankings/${category}/teams?${queryString}`);
  }, [category, division, seasons, fetch]);

  return {
    data: sortTeams(data, numberOfResultsCountedToPointsTotal),
    loading,
    error,
  };
};

export type GetRankedTeamsLazyResult = {
  fetch: (url: string, requestInit?: RequestInit) => Promise<void>;
  data: RankedTeams;
  loading: boolean;
  error: boolean;
};

export const useGetRankedTeamsLazy = (
  numberOfResultsCountedToPointsTotal?: number
): GetRankedTeamsLazyResult => {
  console.log(`useGetRankedPlayersLazy hook,
    numberOfResultsCountedToPointsTotal=${numberOfResultsCountedToPointsTotal}`);

  const { fetch, data, loading, error } = useFetch<Array<RankedTeam>>();

  return {
    fetch,
    data: sortTeams(
      data,
      numberOfResultsCountedToPointsTotal ?? tournamentDrawDefaults.numberOfResultsCountedToPointsTotal
    ),
    loading,
    error,
  };
};

const sortTeams = (
  data: Array<RankedTeam> | undefined,
  numberOfResultsCountedToPointsTotal: number
): RankedTeams =>
  data
    ?.map<RankedTeams[number]>((team) => ({
      teamId: team.id,
      teamUid: team.uid,
      name: team.name,
      playerOne: team.players[0],
      playerTwo: team.players[1],
      points: getTotalPointsFromXBestResults(team.tournamentResults, numberOfResultsCountedToPointsTotal),
      tournamentResults: team.tournamentResults,
    }))
    .sort((teamA, teamB) => teamB.points - teamA.points) ?? [];
