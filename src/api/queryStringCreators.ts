import { TimePeriod } from "@/utils";
import { RankedPlayersFilter, RankedTeamsFilter, TournamentResultsFilter } from "./apiTypes";
import { Category, Division } from "@/domain";

//TODO test
export const createRankedPlayersFilterQueryString = ({
  resultCategories,
  resultDivisions,
  includeEntitiesWithNoTournamentResults,
  playerCategory,
  seasons,
}: RankedPlayersFilter): string => {
  const playerCategoryParam = playerCategory ? `playerCategory=${playerCategory}` : "";

  return createQueryStringParameters([
    playerCategoryParam,
    getResultCategoriesParam(resultCategories),
    getResultDivisionsParam(resultDivisions),
    getSeasonsParam(seasons),
    getIncludeEntitiesWithNoTournamentResultsParam(includeEntitiesWithNoTournamentResults),
  ]);
};

export const createRankedTeamsFilterQueryString = ({
  resultCategories,
  resultDivisions,
  includeEntitiesWithNoTournamentResults,
  seasons,
  teamCategory,
}: RankedTeamsFilter): string => {
  const teamCategoryParam = teamCategory ? `teamCategory=${teamCategory}` : "";

  return createQueryStringParameters([
    teamCategoryParam,
    getResultCategoriesParam(resultCategories),
    getResultDivisionsParam(resultDivisions),
    getSeasonsParam(seasons),
    getIncludeEntitiesWithNoTournamentResultsParam(includeEntitiesWithNoTournamentResults),
  ]);
};

export const createTournamentResultsFilterQueryString = ({
  resultCategories,
  resultDivisions,
  seasons,
}: TournamentResultsFilter): string =>
  createQueryStringParameters([
    getResultCategoriesParam(resultCategories),
    getResultDivisionsParam(resultDivisions),
    getSeasonsParam(seasons),
  ]);

export const createQueryStringParameters = (parameters: Array<string>): string =>
  parameters.filter((param) => !!param).join("&");

const getIncludeEntitiesWithNoTournamentResultsParam = (value?: boolean) =>
  value ? `includeEntitiesWithNoTournamentResults=${value}` : "";

const getResultCategoriesParam = (value?: Array<Category>) =>
  value?.length ? `resultCategories${value.length === 1 ? encodeURI(`[]`) : ""}=${value.join()}` : "";

const getResultDivisionsParam = (value?: Array<Division>) =>
  value?.length ? `resultDivisions${value.length === 1 ? encodeURI(`[]`) : ""}=${value.join()}` : "";

const getSeasonsParam = (value?: TimePeriod) =>
  value ? `seasons${encodeURI(`[from]=${value.from}`)}&seasons${encodeURI(`[to]=${value.to}`)}` : "";
