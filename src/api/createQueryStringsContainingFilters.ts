import { Division } from "@/domain";
import { TimePeriod } from "@/utils";

export const createQueryString = (division?: Division, seasons?: TimePeriod): string => {
  const divisionParam = division ? `division=${division}` : "";
  const seasonsParam = seasons
    ? `seasons${encodeURI(`[from]=${seasons.from}`)}&seasons${encodeURI(`[to]=${seasons.to}`)}`
    : "";

  return `${divisionParam}${divisionParam && seasonsParam ? "&" : ""}${seasonsParam}`;
};
