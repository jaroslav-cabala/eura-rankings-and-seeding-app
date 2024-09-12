import { useCallback, useState } from "react";

export type UseFetchResult<T> = {
  fetch: (url: string, requestInit?: RequestInit) => Promise<void>;
  data: T | undefined;
  loading: boolean;
  error: boolean;
};

export const useFetchLazy = <T>(): UseFetchResult<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(async (fetchUrl: string, requestInit?: RequestInit) => {
    setIsError(false);
    setIsLoading(true);

    try {
      // handle also cases when Response.OK is false
      const response = await fetch(new URL(fetchUrl), requestInit);
      const json: T = await response.json();

      setData(json);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetch: fetchData,
    data,
    loading: isLoading,
    error: isError,
  };
};
