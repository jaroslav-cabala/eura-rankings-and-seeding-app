export const capitalizeFirstChar = (string: string) => string[0].toUpperCase() + string.slice(1)

// this function extracts the year from a string that represents the date of tournament
// date is in format yyyy-mm-dd
export const extractYearFromTournamentDate = (date: string) => date.split('-')[0]

export const getCurrentYear = new Date(Date.now()).getFullYear();

export type TimePeriod = { from: string; to: string; }

