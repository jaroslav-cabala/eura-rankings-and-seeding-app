import { Division } from "@/domain";
import { TimePeriod } from "@/utils";

export const createQueryString = (division: Division, seasons: TimePeriod): string =>
  `division=${division}&seasons${encodeURI(`[from]=${seasons.from}`)}&seasons${encodeURI(`[to]=${seasons.to}`)}`;
