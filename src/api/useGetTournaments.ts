import { useEffect } from "react";
import { TournamentDTO } from "@/api/apiTypes";
import { useFetchLazy } from "./useFetch";

export type UseGetTournamentsResult = {
  data?: Array<TournamentDTO>;
  loading: boolean;
  error: boolean;
};

export const useGetTournaments = (fetchUrl: string): UseGetTournamentsResult => {
  console.log(`useGetTournaments hook`);

  const { fetch, data, loading, error } = useFetchLazy<Array<TournamentDTO>>();

  useEffect(() => {
    fetch(fetchUrl);
  }, [fetchUrl, fetch]);

  return { data, loading, error };
};
