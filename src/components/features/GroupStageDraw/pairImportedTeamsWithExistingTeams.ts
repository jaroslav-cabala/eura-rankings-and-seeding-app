import { GroupStageDrawTeamDTO } from "@/api/apiTypes";
import { fetchRankedTeams } from "./fetchRankedTeams";
import { fetchRankedPlayers } from "./fetchRankedPlayers";

export const pairImportedTeamsWithExistingTeams = async (
  fileWithImportedTeams: File
): Promise<Array<GroupStageDrawTeamDTO>> => {
  const importedTeams = await parseFileWithImportedTeams(fileWithImportedTeams);

  // Get all ranked teams with all their results.
  const rankedTeams = await fetchRankedTeams();

  // Get all players with all their results.
  // TODO maybe move this import of teams functionality to the backend ? Fetching all ranked players might become
  // a pain if there's tons of data, but certainly not now
  const rankedPlayers = await fetchRankedPlayers();

  const tournamentTeams: Array<GroupStageDrawTeamDTO> = [];

  for (const importedTeam of importedTeams) {
    // discard a duplicate team
    if (
      tournamentTeams.find(
        (team) =>
          team.name === importedTeam.name &&
          team.players.find((player) => player.name === importedTeam.playerOneName) &&
          team.players.find((player) => player.name === importedTeam.playerTwoName)
      )
    ) {
      continue;
    }

    const existingTeam = rankedTeams.find(
      (rankedTeam) =>
        rankedTeam.name === importedTeam.name &&
        rankedTeam.players.find((rankedTeamPlayer) => rankedTeamPlayer.name === importedTeam.playerOneName) &&
        rankedTeam.players.find((rankedTeamPlayer) => rankedTeamPlayer.name === importedTeam.playerTwoName)
    );

    const existingPlayerOne = rankedPlayers.find(
      (rankedPlayer) => rankedPlayer.name === importedTeam.playerOneName
    );
    const existingPlayerTwo = rankedPlayers.find(
      (rankedPlayer) => rankedPlayer.name === importedTeam.playerTwoName
    );

    // TODO fix scenario when existingTeam is not found, because the team name is not found in the repository.
    // Players changed their team name or there is a typo, but the actual players from that team already played
    // together under a different name. User should be notified on UI about this discrepancy and should be able
    // to change the team name for all existing records in the db or do smth else....
    if (existingTeam && existingPlayerOne && existingPlayerTwo) {
      tournamentTeams.push({
        uid: existingTeam.uid,
        name: existingTeam.name,
        categories: existingTeam.categories,
        tournamentResults: existingTeam.tournamentResults,
        players: [
          {
            uid: existingPlayerOne.uid,
            name: existingPlayerOne.name,
            isWoman: existingPlayerOne.isWoman,
            tournamentResults: existingPlayerOne.tournamentResults,
          },
          {
            uid: existingPlayerTwo.uid,
            name: existingPlayerTwo.name,
            isWoman: existingPlayerTwo.isWoman,
            tournamentResults: existingPlayerTwo.tournamentResults,
          },
        ],
      });
    } else {
      // team is not found in the ranked teams, it is either a new team.
      // Both or one of the players might already exist in the system so we need check that.
      tournamentTeams.push({
        uid: undefined,
        name: importedTeam.name,
        categories: [],
        tournamentResults: [],
        players: [
          existingPlayerOne
            ? {
                uid: existingPlayerOne.uid,
                name: existingPlayerOne.name,
                isWoman: existingPlayerOne.isWoman,
                tournamentResults: existingPlayerOne.tournamentResults,
              }
            : {
                name: importedTeam.playerOneName,
                isWoman: false,
                uid: undefined,
                tournamentResults: [],
              },
          existingPlayerTwo
            ? {
                uid: existingPlayerTwo.uid,
                name: existingPlayerTwo.name,
                isWoman: existingPlayerTwo.isWoman,
                tournamentResults: existingPlayerTwo.tournamentResults,
              }
            : {
                name: importedTeam.playerTwoName,
                uid: undefined,
                isWoman: false,
                tournamentResults: [],
              },
        ],
      });
    }
  }

  return tournamentTeams;
};

type ImportedTeam = { name: string; playerOneName: string; playerTwoName: string };

const parseFileWithImportedTeams = async (file: File): Promise<Array<ImportedTeam>> => {
  // TODO solve case where number of substring split by coma is not divisible by 3 -
  // team name or player's name is missing for some reason
  // maybe log the error when parsing of the .csv file fails
  const importedTeamsFileContents = await file.text();
  const importedTeamsCsvRows = importedTeamsFileContents.trim().split(/[\n]/);
  const importedTeams: Array<ImportedTeam> = [];
  for (const row of importedTeamsCsvRows) {
    const importedTeam = row.split(",");
    importedTeams.push({
      name: importedTeam[0].trim(),
      playerOneName: importedTeam[1].trim(),
      playerTwoName: importedTeam[2].trim(),
    });
  }

  return importedTeams;
};
