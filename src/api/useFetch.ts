import { useCallback, useState } from "react";

export type UseFetchResult<T> = {
  fetch: (url: string, requestInit?: RequestInit) => Promise<void>;
  data: T | undefined;
  loading: boolean;
  error: boolean;
  completed: boolean;
};

export const useFetchLazy = <T>(): UseFetchResult<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState(false);

  const fetchData = useCallback(async (fetchUrl: string, requestInit?: RequestInit) => {
    setError(false);
    setLoading(true);

    try {
      // handle also cases when Response.OK is false
      const response = await fetch(new URL(fetchUrl), requestInit);
      const json: T = await response.json();

      setData(json);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
      setCompleted(true);
    }
  }, []);

  return {
    fetch: fetchData,
    data,
    loading,
    error,
    completed,
  };
};
