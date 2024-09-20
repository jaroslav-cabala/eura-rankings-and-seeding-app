import { Division } from "@/domain";
import { TimePeriod } from "@/utils";

export const createQueryString = (divisions?: Array<Division>, seasons?: TimePeriod): string => {
  const divisionParam = divisions
    ? divisions.map((division, index) => `${index ? "&" : ""}division=${division}`)
    : "";
  const seasonsParam = seasons
    ? `seasons${encodeURI(`[from]=${seasons.from}`)}&seasons${encodeURI(`[to]=${seasons.to}`)}`
    : "";

  return `${divisionParam}${divisionParam && seasonsParam ? "&" : ""}${seasonsParam}`;
};
