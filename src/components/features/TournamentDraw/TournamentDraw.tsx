import { FC, useReducer, useState } from "react";
import { Import, Loader2, RotateCcw, Save } from "lucide-react";
import "./TournamentDraw.css";
import { TournamentDrawSettings } from "./TournamentDrawSettings";
import { Groups } from "./Groups";
import { drawGroups } from "./drawGroups";
import { Button } from "@/components/ui/button";
import { AddTeam } from "./AddTeam";
import { TournamentDrawDTO, TournamentDrawPlayerDTO, TournamentDrawTeamDTO } from "@/api/apiTypes";
import { tournamentDrawReducer, TournamentDrawReducerActionType } from "./tournamentDrawReducer";
import { Teams } from "./Teams";
import { useFetchLazy } from "@/api/useFetch";
import { useToast } from "@/components/ui/hooks/use-toast";
import { pairImportedTeamsWithExistingTeams } from "./pairImportedTeamsWithExistingTeams";
import { Category } from "@/domain";
import { TournamentDrawsMenu } from "./TournamentDrawsMenu";
import { calculateSeedingPointsOfTeams } from "./calculateSeedingPoints";
import { checkIfTeamOrPlayersAreAlreadyInTheTournament } from "./checkIfTeamOrPlayersAreAlreadyInTheTournament";

// TODO improve this type with never. There are 2 options - either we count player points
// in which case team points is sum of the player points
// or we count team points in which case players have no points
export type TournamentDrawTeam = Omit<TournamentDrawTeamDTO, "players"> & {
  belongsInTheSelectedCategory: boolean;
  points: number;
  players: Array<TournamentDrawPlayerDTO & { points: number }>;
};

export type GroupStage = {
  powerpools?: Array<Array<TournamentDrawTeam>>;
  groups?: Array<Array<TournamentDrawTeam>>;
};

type TournamentDrawProps = {
  tournamentDrawId?: string;
  tournamentDrawInitial?: TournamentDrawDTO;
};

export const TournamentDraw: FC<TournamentDrawProps> = ({ tournamentDrawId, tournamentDrawInitial }) => {
  const [tournamentDraw, dispatch] = useReducer(
    tournamentDrawReducer,
    tournamentDrawInitial ?? newTournamentDraw
  );
  const [groupStage, setGroupStage] = useState<GroupStage | undefined>(undefined);
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
      checkIfTeamOrPlayersAreAlreadyInTheTournament(newTeam, tournamentDraw.teams);

    if (isNewTeamAlreadyInTheTournament) {
      let toastMessage = undefined;
      switch (reason) {
        case "existingTeam":
          toastMessage = (
            <div>
              Team&nbsp;<span className="font-medium">'{newTeam.name}'</span>&nbsp;is already in the
              tournament!
            </div>
          );
          break;
        case "bothPlayersExisting":
          toastMessage = (
            <div>
              Both &nbsp;<span className="font-medium">'{newTeam.players[0].name}'</span>
              &nbsp;and&nbsp;
              <span className="font-medium">'{newTeam.players[1].name}'</span>&nbsp;are already in the
              tournament!
            </div>
          );
          break;
        case "existingPlayerOne":
          toastMessage = (
            <div>
              Player&nbsp;<span className="font-medium">'{newTeam.players[0].name}'</span>&nbsp;is already in
              the tournament!
            </div>
          );
          break;
        case "existingPlayerTwo":
          toastMessage = (
            <div>
              Player&nbsp;<span className="font-medium">'{newTeam.players[1].name}'</span>&nbsp;is already in
              the tournament!
            </div>
          );
          break;
      }

      toast({
        description: toastMessage,
      });

      return false;
    } else {
      dispatch({ type: TournamentDrawReducerActionType.AddTeam, team: newTeam });
      return true;
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

  const teamsWithPoints = calculateSeedingPointsOfTeams(
    tournamentDraw.teams,
    tournamentDraw.category,
    tournamentDraw.divisions,
    tournamentDraw.teamPointsCountMethod,
    tournamentDraw.numberOfBestResultsCountedToPointsTotal
  );

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
    <section className="flex gap-7 m-auto min-w-[600px] pt-2 pr-2 pb-2">
      <TournamentDrawsMenu
        selectedTournamentDrawId={tournamentDraw.id}
        selectedTournamentDrawName={tournamentDraw.name}
      />
      <div className="flex flex-grow-[3] gap-7">
        <div className="py-2 flex-grow flex-shrink basis-2/6 min-w-[420px]">
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
        <div className=" py-2 flex-grow-[4] flex-shrink-1 basis-4/6">
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

const GroupsPlaceholder = (
  <div className="flex flex-wrap gap-4">
    {Array(8)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="h-52 w-[220px] bg-[hsl(var(--accent))] rounded-sm" />
      ))}
  </div>
);

const newTournamentDraw: TournamentDrawDTO = {
  modified: 0,
  id: "",
  name: "",
  divisions: [],
  category: Category.Open,
  groups: 0,
  powerpools: 0,
  powerpoolTeams: 0,
  teamPointsCountMethod: "sumOfPlayersPoints",
  numberOfBestResultsCountedToPointsTotal: 0,
  teams: [],
};
