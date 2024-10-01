import { FC, useReducer, useState } from "react";
import {
  ChevronsDown,
  ChevronsRight,
  CirclePlus,
  Import,
  Loader2,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import "./TournamentDraw.css";
import { Settings } from "./Settings";
import { Groups } from "./Groups";
import { drawGroups } from "./drawGroups";
import { Button } from "@/components/ui/button";
import { AddTeam } from "./AddTeam";
import { TournamentDrawDTO, TournamentDrawPlayerDTO, TournamentDrawTeamDTO } from "@/api/apiTypes";
import { groupStageDrawReducer, groupStageDrawReducerActionType } from "./groupStageDrawReducer";
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

type GroupStageDrawProps = {
  groupStageDrawId?: string;
  groupStageDrawInitialState?: TournamentDrawDTO;
};

export const GroupStageDraw: FC<GroupStageDrawProps> = ({ groupStageDrawId, groupStageDrawInitialState }) => {
  const [tournamentDraw, dispatch] = useReducer(
    groupStageDrawReducer,
    groupStageDrawInitialState ?? newgroupStageDrawInitialStateDraw
  );
  const [groupStage, setGroupStage] = useState<GroupStage | undefined>(undefined);
  const [addTeamFormVisible, setAddTeamFormVisible] = useState(false);
  const { fetch, data: saveResponse, loading: saveInProgress, error: saveError } = useFetchLazy<boolean>();
  const { toast } = useToast();

  const importTeamsFromFwango = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const importedTeamsFile = e.target.files?.[0];

    if (importedTeamsFile) {
      try {
        const teams = await pairImportedTeamsWithExistingTeams(importedTeamsFile);

        dispatch({ type: groupStageDrawReducerActionType.SetTeams, teams: teams });
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
      dispatch({ type: groupStageDrawReducerActionType.AddTeam, team: newTeam });
      return true;
    }
  };

  // const drawGroupsHandler = (): void => {
  //   const drawnGroups = drawGroups(teamsWithPoints, {
  //     groups: tournamentDraw.groups,
  //     powerpools: tournamentDraw.powerpools,
  //     powerpoolTeams: tournamentDraw.powerpoolTeams,
  //   });
  //   setGroupStage(drawnGroups);
  // };

  // const resetTournament = (): void => {
  //   dispatch({ type: groupStageDrawReducerActionType.Reset });
  //   setGroupStage(undefined);
  // };

  // const saveTournamentDraw = async (): Promise<void> => {
  //   // TODO think about this function. Async operation is executed here but we are not waiting for the result...
  //   // what about errors ?
  //   fetch(`http:localhost:3001/tournament-draws/${tournamentDrawId}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(tournamentDraw),
  //   });
  // };

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

  const drawnGroups = drawGroups(teamsWithPoints, {
    groups: tournamentDraw.groups,
    powerpools: tournamentDraw.powerpools,
    powerpoolTeams: tournamentDraw.powerpoolTeams,
  });

  return (
    <section className="flex m-auto justify-center min-w-[400px] max-w-[2200px] px-2 py-4">
      {/* <TournamentDrawsMenu
        selectedTournamentDrawId={tournamentDraw.id}
        selectedTournamentDrawName={tournamentDraw.name} 
      /> */}
      <div className="grid gap-y-10 min-w-[400px] grid-cols-1 sm:w-[630px] lg:w-auto lg:min-w-[1024px] lg:max-xl:grid-cols-[1fr_1.7fr] lg:grid-rows-[minmax(0,auto)] lg:gap-6 xl:min-w-[1280px] xl:grid-cols-[1fr_1.7fr] 2xl:min-w-[1536px]">
        <div className="p-2 row-start-1 row-end-2 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2">
          <Settings groupStageDrawSettings={tournamentDrawSettings} setGroupStageDrawSettings={dispatch} />
        </div>
        <div className="p-2 row-start-2 row-end-3 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3 flex flex-col">
          <div className="mb-6 flex flex-col gap-2 sm:max-lg:flex-row sm:max-lg:gap-0 lg:max:xl:gap-2 2xl:flex-row 2xl:gap-0">
            <div className="flex items-center">
              <span className="title">Teams ({tournamentDraw.teams.length})</span>
              <Button
                onClick={() => dispatch({ type: groupStageDrawReducerActionType.Reset })}
                title="Delete all teams"
                variant="icon"
                size="icon_small"
                className="hover:text-[hsl(var(--destructive))]"
              >
                <Trash2 />
              </Button>
            </div>
            <div className="flex justify-between sm:max-lg:ml-auto sm:max-lg:gap-2 2xl:ml-auto 2xl:gap-2">
              <Button
                variant="link"
                className="pr-4 pl-0"
                onClick={() => setAddTeamFormVisible((val) => !val)}
              >
                {addTeamFormVisible ? (
                  <>
                    <ChevronsDown className="h-6" />
                    Hide add team form
                  </>
                ) : (
                  <>
                    <ChevronsRight className="h-6" />
                    Add team
                  </>
                )}
              </Button>
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
                  Import teams
                </label>
              </Button>
            </div>
          </div>
          {addTeamFormVisible && (
            <div className="mb-6">
              <AddTeam
                addTeamHandler={addTeam}
                category={tournamentDraw.category}
                divisions={tournamentDraw.divisions}
              />
            </div>
          )}
          <Teams
            removeTeam={dispatch}
            teams={teamsWithPoints}
            teamPointsCountMethod={tournamentDraw.teamPointsCountMethod}
          />
        </div>
        <div className="p-2 row-start-3 row-end-4 lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3">
          {drawnGroups ? (
            <Groups groups={drawnGroups.groups} powerpools={drawnGroups.powerpools} />
          ) : (
            GroupsPlaceholder
          )}
        </div>
      </div>
    </section>
  );
};

const GroupsPlaceholder = (
  <div className="flex flex-wrap gap-6">
    <div className="w-full text-left title">
      <h1>Groups</h1>
    </div>
    {Array(8)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="h-52 w-[220px] bg-[hsl(var(--accent))] rounded-sm" />
      ))}
  </div>
);

const newgroupStageDrawInitialStateDraw: TournamentDrawDTO = {
  modified: 0,
  id: "",
  name: "",
  divisions: [],
  category: Category.Open,
  groups: 4,
  powerpools: 0,
  powerpoolTeams: 0,
  teamPointsCountMethod: "sumOfPlayersPoints",
  numberOfBestResultsCountedToPointsTotal: 0,
  teams: [],
};
