import { useCallback, useState } from "react";

export type UseFetchResult<T> = {
  fetch: (
    url: string,
    requestInit?: RequestInit,
    onSuccessAction?: (response: Response) => void,
    onErrorAction?: (response: unknown) => void,
    onCompletedAction?: () => void
  ) => Promise<void>;
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

  const fetchData = useCallback(
    async (
      fetchUrl: string,
      requestInit?: RequestInit,
      onSuccessAction?: (response: Response) => void,
      onErrorAction?: (error: unknown) => void,
      onCompletedAction?: () => void
    ) => {
      setError(false);
      setLoading(true);
      setCompleted(false);
      setData(undefined);

      try {
        // handle also cases when Response.OK is false
        const response = await fetch(new URL(fetchUrl), requestInit);
        const json: T = await response.json();

        setData(json);
        onSuccessAction?.(response);
      } catch (error) {
        setError(true);
        onErrorAction?.(error);
      } finally {
        setLoading(false);
        setCompleted(true);
        onCompletedAction?.();
      }
    },
    []
  );

  return {
    fetch: fetchData,
    data,
    loading,
    error,
    completed,
  };
};
