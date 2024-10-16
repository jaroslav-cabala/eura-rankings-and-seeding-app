import { GroupStageDrawTeamDTO } from "@/api/apiTypes";

export type CheckIfTeamOrPlayerIsAlreadyInTheTournamentResultDuplicityReason =
  | "existingTeam"
  | "existingPlayerOne"
  | "existingPlayerTwo"
  | "bothPlayersExisting";

export type CheckIfTeamOrPlayerIsAlreadyInTheTournamentResult = {
  checkResult: boolean;
  reason: CheckIfTeamOrPlayerIsAlreadyInTheTournamentResultDuplicityReason | null;
};

export const checkIfTeamOrPlayersAreAlreadyInTheTournament = (
  newTeam: GroupStageDrawTeamDTO,
  existingTeams: Array<GroupStageDrawTeamDTO>
): CheckIfTeamOrPlayerIsAlreadyInTheTournamentResult => {
  let reason: CheckIfTeamOrPlayerIsAlreadyInTheTournamentResultDuplicityReason | null = null;

  // check if the new team is already in the tournament
  const isTeamAlreadyAlreadyInTheTournament = !!existingTeams.find(
    (existingTeam) => existingTeam.uid === newTeam.uid && existingTeam.name === newTeam.name
  );

  if (isTeamAlreadyAlreadyInTheTournament) {
    return {
      checkResult: true,
      reason: "existingTeam",
    };
  }

  // check if any of the players in the new team are already in the tournament
  let IsPlayerOneAlreadyInTheTournament = false;
  let IsPlayerTwoAlreadyInTheTournament = false;

  const newTeamPlayerOne = newTeam.players[0];
  const newTeamPlayerTwo = newTeam.players[1];
  for (const existingTeam of existingTeams) {
    if (IsPlayerTwoAlreadyInTheTournament && IsPlayerOneAlreadyInTheTournament) {
      break;
    }

    if (!IsPlayerOneAlreadyInTheTournament) {
      IsPlayerOneAlreadyInTheTournament =
        existingTeam.players.map((p) => p.uid).includes(newTeamPlayerOne.uid) &&
        existingTeam.players.map((p) => p.name).includes(newTeamPlayerOne.name);
    }
    if (!IsPlayerTwoAlreadyInTheTournament) {
      IsPlayerTwoAlreadyInTheTournament =
        existingTeam.players.map((p) => p.uid).includes(newTeamPlayerTwo.uid) &&
        existingTeam.players.map((p) => p.name).includes(newTeamPlayerTwo.name);
    }
  }

  if (IsPlayerOneAlreadyInTheTournament && IsPlayerTwoAlreadyInTheTournament) {
    reason = "bothPlayersExisting";
  }

  if (IsPlayerOneAlreadyInTheTournament && !IsPlayerTwoAlreadyInTheTournament) {
    reason = "existingPlayerOne";
  }

  if (IsPlayerTwoAlreadyInTheTournament && !IsPlayerOneAlreadyInTheTournament) {
    reason = "existingPlayerTwo";
  }

  return {
    checkResult: !!reason,
    reason,
  };
};
