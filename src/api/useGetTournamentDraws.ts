import { useEffect } from "react";
import { TournamentDrawNameAndIdDTO } from "./apiTypes";
import { useFetchLazy } from "./useFetch";

export type UseGetTournamentDrawsResult = {
  data?: Array<TournamentDrawNameAndIdDTO>;
  loading: boolean;
  error: boolean;
};

export const useGetTournamentDraws = (): UseGetTournamentDrawsResult => {
  const { fetch, data, loading, error } = useFetchLazy<Array<TournamentDrawNameAndIdDTO>>();

  useEffect(() => {
    fetch(`http:localhost:3001/tournament-draws`);
  }, [fetch]);

  return {
    data,
    loading,
    error,
  };
};
