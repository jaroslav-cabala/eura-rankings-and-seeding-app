import { useEffect } from "react";
import { GroupStageDrawDTO } from "./apiTypes";
import { useFetchLazy } from "./useFetch";

export type UseGetGroupStageDrawResult = {
  data?: GroupStageDrawDTO;
  loading: boolean;
  error: boolean;
};

// TODO status 200 response is error as a result from the fetch ?????
export const useGetGroupStageDraw = (id: string): UseGetGroupStageDrawResult => {
  const { fetch, data, loading, error } = useFetchLazy<GroupStageDrawDTO>();

  useEffect(() => {
    fetch(`http:localhost:3001/groupstage-draws/${id}`);
  }, [id, fetch]);

  return {
    data,
    loading,
    error,
  };
};
