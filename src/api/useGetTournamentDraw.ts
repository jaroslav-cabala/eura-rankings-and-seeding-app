import { useEffect } from "react";
import { TournamentDrawDTO } from "./apiTypes";
import { useFetchLazy } from "./useFetch";

export type UseGetTournamentDrawResult = {
  data?: TournamentDrawDTO;
  loading: boolean;
  error: boolean;
};

// TODO status 200 response is error as a result from the fetch ?????
export const useGetTournamentDraw = (id: string): UseGetTournamentDrawResult => {
  const { fetch, data, loading, error } = useFetchLazy<TournamentDrawDTO>();

  useEffect(() => {
    fetch(`http:localhost:3001/tournament-draws/${id}`);
  }, [id, fetch]);

  return {
    data,
    loading,
    error,
  };
};
