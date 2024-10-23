import { useCallback, useState } from "react";

export type UseFetchResult<T> = {
  fetch: FetchFn<T>;
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

  const fetchData: FetchFn<T> = useCallback(
    async ({ fetchUrl, requestInit, onCompletedAction, onErrorAction, onSuccessAction }) => {
      setError(false);
      setLoading(true);
      setCompleted(false);
      setData(undefined);

      try {
        // handle also cases when Response.OK is false
        const response = await fetch(new URL(fetchUrl), requestInit);
        const json: T = await response.json();

        setData(json);
        onSuccessAction?.(json);
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

type FetchFn<T> = (params: {
  fetchUrl: string;
  requestInit?: RequestInit;
  onSuccessAction?: (response: T) => void;
  onErrorAction?: (error: unknown) => void;
  onCompletedAction?: () => void;
}) => Promise<void>;
