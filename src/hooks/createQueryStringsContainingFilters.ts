import { Division } from "@/domain";
import { TimePeriod } from "@/utils";

export const createQueryString = (
  division: Division,
  seasons: TimePeriod
): string =>
  `division=${division}&seasons=${encodeURI(`{from:"${seasons.from}",to:"${seasons.to}"}`)}`;
