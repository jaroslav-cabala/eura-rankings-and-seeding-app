import { FC, useReducer, useState } from "react";
import { Import, Loader2, RotateCcw, Save, SquarePlus } from "lucide-react";
import { useParams } from "@tanstack/react-router";
import "./TournamentDraw.css";
import { TournamentDrawSettings } from "./TournamentDrawSettings";
import { Groups } from "./Groups";
import { drawGroups } from "./drawGroups";
import { Button } from "@/components/ui/button";
import { AddTeam } from "./AddTeam";
import {
  TeamPointsCountMethod,
  TournamentDrawDTO,
  TournamentDrawPlayerDTO,
  TournamentDrawTeamDTO,
} from "@/api/apiTypes";
import { useGetTournamentDraw } from "@/api/useGetTournamentDraw";
import { useGetTournamentDraws } from "@/api/useGetTournamentDraws";
import { tournamentDrawReducer, TournamentDrawReducerActionType } from "./tournamentDrawReducer";
import { Teams } from "./Teams";
import { getTotalPointsFromXBestResults } from "@/lib/getTotalPointsFromXBestResults";
import { useFetchLazy } from "@/api/useFetch";
import { useToast } from "@/components/ui/hooks/use-toast";
import { pairImportedTeamsWithExistingTeams } from "./pairImportedTeamsWithExistingTeams";
import { filterTournamentResults } from "@/lib/filterTournamentResults";

export const TournamentDraw = () => {
  const params = useParams({ from: "/tournament-draws/$tournamentDrawId" });
  const {
    data: tournamentDraw,
    loading: tournamentDrawLoading,
    error: tournamentDrawError,
  } = useGetTournamentDraw(params.tournamentDrawId);
  const {
    data: tournamentDraws,
    loading: tournamentDrawsLoading,
    error: tournamentDrawsError,
  } = useGetTournamentDraws();

  if (tournamentDrawError || tournamentDrawsError) {
    return (
      <section id="fullscreen-section">
        <div className="py-2">Error while fetching tournament draw data</div>
      </section>
    );
  }

  if (tournamentDrawLoading || tournamentDrawsLoading || !tournamentDraw || !tournamentDraws) {
    return (
      <section>
        <div className="py-2">
          <Loader2 className="animate-spin mr-2" />
          Loading tournament draw data...
        </div>
      </section>
    );
  }

  return (
    <TournamentDrawComponent
      tournamentDrawId={params.tournamentDrawId}
      tournamentDrawInitial={tournamentDraw}
      tournamentDrawsInitial={tournamentDraws}
    />
  );
};

type TournamentDrawComponentProps = {
  tournamentDrawId: string;
  tournamentDrawInitial: TournamentDrawDTO;
  tournamentDrawsInitial: Array<TournamentDrawDTO>;
};

const TournamentDrawComponent: FC<TournamentDrawComponentProps> = ({
  tournamentDrawId,
  tournamentDrawInitial,
  tournamentDrawsInitial,
}) => {
  const [tournamentDraws, setTournamentDraws] = useState<Array<TournamentDrawDTO>>(tournamentDrawsInitial);
  const [tournamentDraw, dispatch] = useReducer(tournamentDrawReducer, tournamentDrawInitial);
  const [groupStage, setGroupStage] = useState<GroupStage | undefined>(undefined);
  // const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { fetch, data: saveResponse, loading: saveInProgress, error: saveError } = useFetchLazy<boolean>();
  const { toast } = useToast();

  const importTeamsFromFwango = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const importedTeamsFile = e.target.files?.[0];

    if (importedTeamsFile) {
      try {
        const teams = await pairImportedTeamsWithExistingTeams(importedTeamsFile);

        dispatch({ type: TournamentDrawReducerActionType.SetTeams, teams: teams });
      } catch (error) {
        //toast
      }
    } else {
      // toast
    }
  };

  // Handles adding of a team into the tournament. Returns true if the operation was successful,
  // false otherwise.
  const addTeam = (newTeam: TournamentDrawTeamDTO): boolean => {
    const { checkResult: isNewTeamAlreadyInTheTournament, reason } =
      checkIfTeamOrPlayerIsAlreadyInTheTournament(newTeam, tournamentDraw.teams);

    if (isNewTeamAlreadyInTheTournament === false) {
      dispatch({ type: TournamentDrawReducerActionType.AddTeam, team: newTeam });
      return true;
    } else {
      let toastMessage = undefined;
      switch (reason) {
        case "existingTeam":
          toastMessage = (
            <>
              Team&nbsp;<span className="font-medium">'{newTeam.name}'</span>&nbsp;is already in the
              tournament!
            </>
          );
          break;
        case "bothPlayersExisting":
          toastMessage = (
            <>
              Both players&nbsp;<span className="font-medium">'{newTeam.players[0].name}'</span>
              &nbsp;and&nbsp;
              <span>'{newTeam.players[1].name}'</span>&nbsp;are already in the tournament!
            </>
          );
          break;
        case "existingPlayerOne":
          toastMessage = (
            <>
              Player&nbsp;<span className="font-medium">'{newTeam.players[0].name}'</span>&nbsp;is already in
              the tournament!
            </>
          );
          break;
        case "existingPlayerTwo":
          toastMessage = (
            <>
              Player&nbsp;<span className="font-medium">'{newTeam.players[1].name}'</span>&nbsp;is already in
              the tournament!
            </>
          );
          break;
      }

      toast({
        description: toastMessage,
      });

      return false;
    }
  };

  const drawGroupsHandler = (): void => {
    const drawnGroups = drawGroups(teamsWithPoints, {
      groups: tournamentDraw.groups,
      powerpools: tournamentDraw.powerpools,
      powerpoolTeams: tournamentDraw.powerpoolTeams,
    });
    setGroupStage(drawnGroups);
  };

  const resetTournament = (): void => {
    dispatch({ type: TournamentDrawReducerActionType.Reset });
    setGroupStage(undefined);
  };

  const saveTournamentDraw = async (): Promise<void> => {
    // TODO think about this function. Async operation is executed here but we are not waiting for the result...
    // what about errors ?
    fetch(`http:localhost:3001/tournament-draws/${tournamentDrawId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tournamentDraw),
    });
  };

  // const createNewTournament = async (): Promise<void> => {
  //   // setTournamentDraws([{ id: "newId", name: "new tournament 1", tournamentDraws: [] }, ...tournamentDraws]);
  // };

  const teamsWithFilteredTournamentResults = tournamentDraw.teams.map((team) => ({
    ...team,
    players: team.players.map((player) => ({
      ...player,
      tournamentResults: filterTournamentResults(
        player.tournamentResults,
        tournamentDraw.category,
        tournamentDraw.divisions
      ),
    })),
    tournamentResults: filterTournamentResults(
      team.tournamentResults,
      tournamentDraw.category,
      tournamentDraw.divisions
    ),
  }));

  const teamsWithPoints = calculateSeedingPointsOfTeams(
    teamsWithFilteredTournamentResults,
    tournamentDraw.teamPointsCountMethod,
    tournamentDraw.numberOfBestResultsCountedToPointsTotal
  );

  // const tournamentDrawsSortedByModifiedDateDescending = [...tournamentDraws].sort(
  //   (a, b) => b.modified - a.modified
  // );

  const tournamentDrawSettings = {
    category: tournamentDraw.category,
    divisions: tournamentDraw.divisions,
    groups: tournamentDraw.groups,
    name: tournamentDraw.name,
    powerpools: tournamentDraw.powerpools,
    powerpoolTeams: tournamentDraw.powerpoolTeams,
    teamCount: tournamentDraw.teams.length,
    teamPointsCountMethod: tournamentDraw.teamPointsCountMethod,
    numberOfBestResultsCountedToPointsTotal: tournamentDraw.numberOfBestResultsCountedToPointsTotal,
  };

  return (
    <section id="tournament-draw">
      {/* <div id="tournament-draws">
        <p className="title pb-6 pt-2 text-center text-white">Tournaments</p>
        <Button variant="outline" className="w-full mb-2 py-1.5 px-3" onClick={createNewTournament}>
          <SquarePlus className="w-6 mr-2" /> Create new
        </Button>
        {tournamentDrawsSortedByModifiedDateDescending?.map((t) => (
          <div key={t.id} id="tournament-draw-item">
            <div id="tournament-draw-name">{t.name}</div>
          </div>
        ))}
      </div> */}
      <div id="group-stage-draw">
        <div id="tournament-teams">
          <div className="mb-6">
            <Button
              variant="destructive"
              className="mr-2"
              onClick={() => {
                resetTournament();
              }}
            >
              <RotateCcw className="w-6 mr-2" />
              Reset
            </Button>
            <Button
              className=""
              onClick={() => {
                saveTournamentDraw();
              }}
              disabled={saveInProgress}
            >
              {saveInProgress ? (
                <>
                  <Loader2 className="w-6 animate-spin mr-2" /> Save
                </>
              ) : (
                <>
                  <Save className="w-6 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
          <AddTeam
            addTeamHandler={addTeam}
            category={tournamentDraw.category}
            divisions={tournamentDraw.divisions}
          />
          <div className="flex justify-between items-center">
            <p className="title py-4">Teams ({tournamentDraw.teams.length})</p>
            <input
              id="import-teams"
              type="file"
              accept=".csv"
              onClick={(e) => (e.currentTarget.value = "")}
              onChange={(e) => importTeamsFromFwango(e)}
              hidden
            />
            <Button asChild>
              <label htmlFor="import-teams" className="cursor-pointer mr-0">
                <Import className="w-6 mr-2" />
                Import teams from Fwango
              </label>
            </Button>
          </div>
          <Teams
            removeTeam={dispatch}
            teams={teamsWithPoints}
            teamPointsCountMethod={tournamentDraw.teamPointsCountMethod}
          />
        </div>
        <div className="group-draw">
          <TournamentDrawSettings
            tournamentDrawSettings={tournamentDrawSettings}
            setTournamentDrawSettings={dispatch}
            drawGroupsHandler={drawGroupsHandler}
          />
          {groupStage ? (
            <Groups groups={groupStage.groups} powerpools={groupStage.powerpools} />
          ) : (
            GroupsPlaceholder
          )}
        </div>
      </div>
    </section>
  );
};

// TODO improve this type with never. There are 2 options - either we count player points
// in which case team points is sum of the player points
// or we count team points in which case players have no points
export type TournamentDrawTeamWithPoints = Omit<TournamentDrawTeamDTO, "players"> & {
  points: number;
  players: Array<TournamentDrawPlayerDTO & { points: number }>;
};

const GroupsPlaceholder = (
  <div className="flex gap-4 w-[600px]">
    {Array(4)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="h-64 w-[300px] bg-[hsl(var(--accent))] rounded-sm" />
      ))}
  </div>
);

type CheckIfTeamOrPlayerIsAlreadyInTheTournamentResultDuplicityReason =
  | "existingTeam"
  | "existingPlayerOne"
  | "existingPlayerTwo"
  | "bothPlayersExisting";

type CheckIfTeamOrPlayerIsAlreadyInTheTournamentResult = {
  checkResult: boolean;
  reason: CheckIfTeamOrPlayerIsAlreadyInTheTournamentResultDuplicityReason | null;
};

const checkIfTeamOrPlayerIsAlreadyInTheTournament = (
  newTeam: TournamentDrawTeamDTO,
  existingTeams: Array<TournamentDrawTeamDTO>
): CheckIfTeamOrPlayerIsAlreadyInTheTournamentResult => {
  let reason: CheckIfTeamOrPlayerIsAlreadyInTheTournamentResultDuplicityReason | null = null;

  const newTeamPlayerUids = newTeam.players.map((p) => p.uid);
  const newTeamPlayerNames = newTeam.players.map((p) => p.name);

  const checkResult = !!existingTeams.find((existingTeam) => {
    if (existingTeam.uid === newTeam.uid && existingTeam.name === newTeam.name) {
      reason = "existingTeam";
      return true;
    }

    let IsPlayerOneTheSame = false;
    let isPlayerTwoTheSame = false;

    IsPlayerOneTheSame =
      newTeamPlayerUids.includes(existingTeam.players[0].uid) &&
      newTeamPlayerNames.includes(existingTeam.players[0].name);

    isPlayerTwoTheSame =
      newTeamPlayerUids.includes(existingTeam.players[1].uid) &&
      newTeamPlayerNames.includes(existingTeam.players[1].name);

    if (IsPlayerOneTheSame && !isPlayerTwoTheSame) {
      reason = "existingPlayerOne";
      return true;
    }

    if (isPlayerTwoTheSame && !IsPlayerOneTheSame) {
      reason = "existingPlayerTwo";
      return true;
    }

    if (isPlayerTwoTheSame && isPlayerTwoTheSame) {
      reason = "bothPlayersExisting";
      return true;
    }

    return false;
  });

  return {
    checkResult,
    reason,
  };
};

export type GroupStage = {
  powerpools?: Array<Group>;
  groups?: Array<Group>;
};

export type Group = {
  teams: Array<TournamentDrawTeamWithPoints>;
};

const calculateSeedingPointsOfTeams = (
  teams: Array<TournamentDrawTeamDTO> | undefined,
  teamPointsCountMethod: TeamPointsCountMethod,
  numberOfResultsCountedToPointsTotal: number
): Array<TournamentDrawTeamWithPoints> => {
  console.log("---------------------------------calculating seeding points of teams in the tournament");

  return teamPointsCountMethod === "sumOfTeamPoints"
    ? teams
        ?.map<TournamentDrawTeamWithPoints>((team) => ({
          ...team,
          players: team.players.map((player) => ({ ...player, points: 0 })),
          points: getTotalPointsFromXBestResults(team.tournamentResults, numberOfResultsCountedToPointsTotal),
        }))
        .sort((teamA, teamB) => teamB.points - teamA.points) ?? []
    : teams
        ?.map<TournamentDrawTeamWithPoints>((team) => {
          const players = team.players.map((player) => ({
            ...player,
            points: getTotalPointsFromXBestResults(
              player.tournamentResults,
              numberOfResultsCountedToPointsTotal
            ),
          }));
          return {
            ...team,
            players,
            points: players[0].points + players[1].points,
          };
        })
        .sort((teamA, teamB) => teamB.points - teamA.points) ?? [];
};
