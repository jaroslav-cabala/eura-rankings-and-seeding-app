import { Category, Division } from "./api/apiTypes";
import { RANKING_ID, rankingIdsMetadataMap } from "./config";

export const capitalizeFirstChar = (string: string) => string[0].toUpperCase() + string.slice(1);

// this function extracts the year from a string that represents the date of tournament
// date is in format yyyy-mm-dd
export const extractYearFromTournamentDate = (date: string): number => parseInt(date.split("-")[0], 10);

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

export const getCurrentYear = new Date(Date.now()).getFullYear();

export type TimePeriod = { from: string; to: string };

export const getHrefToFwangoTournamentResult = (
  tournamentResultId: string,
  category: Category,
  division: Division
) =>
  `https://fwango.io/eura/rankings/${getRankingIdFromCategoryAndDivision(category, division)}/results/${tournamentResultId}`;

// returns a fwango ranking id associated with a specific category and division
export const getRankingIdFromCategoryAndDivision = (
  category: Category,
  division: Division
): RANKING_ID | undefined =>
  (Object.entries(rankingIdsMetadataMap) as Entries<typeof rankingIdsMetadataMap>).find(
    ([, value]) => value.category === category.name && value.division === division.name
  )?.[0];

// move to a separate package(interestingStuff on github)
// Object.entries() type so we get a correct type for the key
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const debounce = <A>(action: (args: A) => void, delayMs: number): typeof action => {
  let timeoutId: number;

  return (actionArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => action(actionArgs), delayMs);
  };
};

export const debounceSubsequent = <A>(action: (args: A) => void, delayMs: number): typeof action => {
  console.log("debounceSubsequent called");
  let timeoutId: number | undefined;

  return (actionArgs) => {
    console.log(`timeoutId=${timeoutId}`);
    if (timeoutId) {
      return;
    }

    action(actionArgs);

    timeoutId = window.setTimeout(() => (timeoutId = undefined), delayMs);
  };
};
