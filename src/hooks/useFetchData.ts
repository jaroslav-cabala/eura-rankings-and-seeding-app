import { useState, useEffect } from "react";

export type UseFetchJsonDataResult<T> = {
  data: T | undefined;
  loading: boolean;
  error: boolean;
};

export const useFetchJsonData = <T>(fetchUrl: string): UseFetchJsonDataResult<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const response = await fetch(new URL(fetchUrl));
        const json: T = await response.json();

        setData(json);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchUrl]);

  return {
    data,
    loading: isLoading,
    error: isError,
  };
};
