import { useState, useEffect } from "react";

export type UseFetchJsonDataResult<T> = {
  data: T | undefined;
  loading: boolean;
  error: boolean;
};

export const useFetchJsonData = <T>(fetchUrl: URL): UseFetchJsonDataResult<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const response = await fetch(fetchUrl);
        const json: T = await response.json();

        setData(json);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    data,
    loading: isLoading,
    error: isError,
  };
};
