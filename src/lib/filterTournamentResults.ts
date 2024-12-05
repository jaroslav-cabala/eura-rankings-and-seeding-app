import { Category, Division, TournamentResultDTO } from "@/api/apiTypes";
import { extractYearFromTournamentDate, TimePeriod } from "@/utils";

export const filterTournamentResults = <T extends TournamentResultDTO>(
  results: Array<T>,
  category?: Category,
  divisions?: Array<Division>,
  seasons?: TimePeriod
): Array<T> =>
  results.filter((result) => {
    const categoryFilterResult = category ? result.category.id === category.id : true;
    const divisionFilterResult = divisions ? divisions?.includes(result.division) : true;

    let seasonsFilterResult = true;
    if (seasons) {
      const fromFilterParsedValue = parseInt(seasons.from, 10);
      const toFilterParsedValue = parseInt(seasons.to, 10);

      seasonsFilterResult = Number.isNaN(fromFilterParsedValue)
        ? true
        : extractYearFromTournamentDate(result.date) >= fromFilterParsedValue &&
            Number.isNaN(toFilterParsedValue)
          ? true
          : extractYearFromTournamentDate(result.date) <= toFilterParsedValue;
    }

    return categoryFilterResult && divisionFilterResult && seasonsFilterResult;
  });
