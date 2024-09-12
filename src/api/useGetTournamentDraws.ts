import { useEffect } from "react";
import { TournamentDrawDTO } from "./apiTypes";
import { useFetchLazy } from "./useFetch";

export type UseGetTournamentDrawsResult = {
  data?: Array<TournamentDrawDTO>;
  loading: boolean;
  error: boolean;
};

export const useGetTournamentDraws = (): UseGetTournamentDrawsResult => {
  const { fetch, data, loading, error } = useFetchLazy<Array<TournamentDrawDTO>>();

  useEffect(() => {
    fetch(`http:localhost:3001/tournament-draws`);
  }, [fetch]);

  return {
    data,
    loading,
    error,
  };
};
