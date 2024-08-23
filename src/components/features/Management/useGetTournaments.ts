import { useEffect } from "react";
import { Tournament } from "@/api/apiTypes";
import { useFetch } from "../../../api/useFetchData";

export type UseGetTournamentsResult = {
  data?: Array<Tournament>;
  loading: boolean;
  error: boolean;
};

export const useGetTournaments = (fetchUrl: string): UseGetTournamentsResult => {
  console.log(`useGetTournaments hook`);

  const { fetch, data, loading, error } = useFetch<Array<Tournament>>();

  useEffect(() => {
    fetch(fetchUrl);
  }, [fetchUrl, fetch]);

  return { data, loading, error };
};
