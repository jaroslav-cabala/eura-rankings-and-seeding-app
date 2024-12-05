import { useEffect } from "react";
import { GroupStageDrawNameIdModifiedDTO } from "./apiTypes";
import { useFetchLazy } from "./useFetch";

export type UseGetGroupStageDrawsResult = {
  data?: Array<GroupStageDrawNameIdModifiedDTO>;
  loading: boolean;
  error: boolean;
};

export const useGetGroupStageDraws = (): UseGetGroupStageDrawsResult => {
  const { fetch, data, loading, error } = useFetchLazy<Array<GroupStageDrawNameIdModifiedDTO>>();

  useEffect(() => {
    fetch({ fetchUrl: `http:localhost:3001/groupstage-draws` });
  }, [fetch]);

  return {
    data,
    loading,
    error,
  };
};
