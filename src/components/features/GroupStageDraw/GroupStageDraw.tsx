import { FC, useReducer, useState } from "react";
import { ChevronsDown, ChevronsRight, Import, Trash2 } from "lucide-react";
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

type GroupStageDrawProps = {
  groupStageDrawId?: string;
  groupStageDrawInitialState?: TournamentDrawDTO;
};

export const GroupStageDraw: FC<GroupStageDrawProps> = ({ groupStageDrawId, groupStageDrawInitialState }) => {
  const [tournamentDraw, dispatch] = useReducer(
    groupStageDrawReducer,
    groupStageDrawInitialState ?? newgroupStageDrawInitialStateDraw
  );
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
    <section className="w-full grid gap-y-10 lg:grid-rows-[minmax(0,auto)] grid-cols-1 lg:gap-6 xl:max-2xl:grid-cols-[1fr_1.35fr] 2xl:grid-cols-[1fr_1.6fr] min-[1920px]:grid-cols-[1fr_2fr]">
      <div className="p-2 row-start-1 row-end-2 xl:col-start-2 xl:col-end-3">
        <div className="flex flex-wrap items-center justify-between mb-10 gap-x-3 gap-y-4">
          <h1 className="font-semibold text-2xl">{tournamentDraw.name}</h1>
          <Button>Save changes</Button>
        </div>
        <Settings groupStageDrawSettings={tournamentDrawSettings} setGroupStageDrawSettings={dispatch} />
      </div>
      <div className="p-2 row-start-2 row-end-3 xl:col-start-1 xl:col-end-2 xl:row-start-1 xl:row-end-3 flex flex-col">
        <div className="mb-6 flex flex-col gap-2 sm:max-xl:flex-row sm:max-xl:gap-0 xl:max-2xl:gap-2 2xl:flex-row 2xl:gap-0">
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
          <div className="flex justify-between sm:gap-2 sm:ml-auto xl:ml-0 2xl:ml-auto">
            <Button variant="link" className="pr-4 pl-0" onClick={() => setAddTeamFormVisible((val) => !val)}>
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
              <label htmlFor="import-teams" className="cursor-pointer mr-0 shadow-sm">
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
      <div className="p-2 row-start-3 row-end-4 xl:col-start-2 xl:col-end-3 xl:row-start-2 xl:row-end-3">
        <Groups
          teamCount={teamsWithPoints.length}
          groups={drawnGroups.groups}
          powerpools={drawnGroups.powerpools}
        />
      </div>
    </section>
  );
};

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
