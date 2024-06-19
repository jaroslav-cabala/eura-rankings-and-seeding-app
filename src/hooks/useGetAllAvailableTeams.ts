import { useState, useEffect } from "react";
import { getTotalPointsFromXBestResults } from "../lib/getTotalPointsFromXBestResults";
import { Player, RankedTeam } from "./types";
import { rankedTeams } from "../testData_rankedTeams";

export type GetAllAvailableTeamsResult = Array<{
  teamId: string;
  teamUid: string;
  name: string;
  playerOne: Player;
  playerTwo: Player;
  points: number;
}>;

export const useGetAllAvailableTeams = (): GetAllAvailableTeamsResult => {
  return rankedTeams.map<GetAllAvailableTeamsResult[number]>((team) => ({
    teamId: team.id,
    teamUid: team.uid,
    name: team.name,
    playerOne: team.players[0],
    playerTwo: team.players[1],
    points: getTotalPointsFromXBestResults(team.tournamentResults, 2)
  }));
};

export type GetAllAvailableTeamsResult2 = {
  data?: GetAllAvailableTeamsResult,
  loading: boolean,
  error: boolean
}

export const useGetAllAvailableTeams2 = (): GetAllAvailableTeamsResult2 => {
  const [data, setData] = useState<GetAllAvailableTeamsResult | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchAllRankedTeams = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const url = new URL('http:localhost:3001/rankings/open/teams')
        const response = await fetch(url);
        const rankedTeams: Array<RankedTeam> = await response.json();

        const result = rankedTeams.map<GetAllAvailableTeamsResult[number]>((team) => ({
          teamId: team.id,
          teamUid: team.uid,
          name: team.name,
          playerOne: team.players[0],
          playerTwo: team.players[1],
          points: getTotalPointsFromXBestResults(team.tournamentResults, 2)
        }));

        setData(result);
      } catch (error) {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllRankedTeams()
  }, [])

  return {
    data,
    loading: isLoading,
    error: isError
  }
};
