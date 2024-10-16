import { FC, PropsWithChildren, useReducer, useState } from "react";
import { ChevronsDown, ChevronsRight, CircleCheck, Import, Loader2, Save, Trash2 } from "lucide-react";
import { Settings } from "./Settings";
import { Groups } from "./Groups";
import { drawGroups } from "./drawGroups";
import { Button } from "@/components/ui/button";
import { AddTeam } from "./AddTeam";
import { GroupStageDrawDTO, GroupStageDrawPlayerDTO, GroupStageDrawTeamDTO } from "@/api/apiTypes";
import { groupStageDrawReducer, groupStageDrawReducerActionType } from "./groupStageDrawReducer";
import { Teams } from "./Teams";
import { useFetchLazy } from "@/api/useFetch";
import { useToast } from "@/components/ui/hooks/use-toast";
import { pairImportedTeamsWithExistingTeams } from "./pairImportedTeamsWithExistingTeams";
import { Category } from "@/domain";
import { calculateSeedingPointsOfTeams } from "./calculateSeedingPoints";
import { checkIfTeamOrPlayersAreAlreadyInTheTournament } from "./checkIfTeamOrPlayersAreAlreadyInTheTournament";
import "./GroupStageDraw.css";
import { ErrorToastMessage } from "./common";
import { useGroupStageDrawMenuContext } from "./GroupStageDrawMenu/GroupStageDrawMenuContext";

// TODO improve this type with never. There are 2 options - either we count player points
// in which case team points is sum of the player points
// or we count team points in which case players have no points
export type GroupStageDrawTeam = Omit<GroupStageDrawTeamDTO, "players"> & {
  belongsInTheSelectedCategory: boolean;
  points: number;
  players: Array<GroupStageDrawPlayerDTO & { points: number }>;
};

type GroupStageDrawProps = {
  groupStageDrawId: string;
  groupStageDrawInitialState: GroupStageDrawDTO;
};

export const GroupStageDraw: FC<GroupStageDrawProps> = ({ groupStageDrawId, groupStageDrawInitialState }) => {
  const { menuItems, setMenuItems } = useGroupStageDrawMenuContext();
  const [groupStageDraw, dispatch] = useReducer(
    groupStageDrawReducer,
    groupStageDrawInitialState ?? newGroupStageDrawInitialState
  );
  const [addTeamFormVisible, setAddTeamFormVisible] = useState(false);
  const { fetch, loading: saveInProgress } = useFetchLazy<boolean>();
  const { toast } = useToast();

  const setGroupStageDrawName = (name: string) => {
    dispatch({
      type: groupStageDrawReducerActionType.SetName,
      name,
    });

    const newMenuItems = menuItems
      .filter((menuItem) => menuItem.id !== groupStageDraw.id)
      .concat([
        {
          id: groupStageDraw.id,
          name,
          modified: groupStageDraw.modified,
        },
      ]);
    setMenuItems(newMenuItems);
  };

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
  const addTeam = (newTeam: GroupStageDrawTeamDTO): boolean => {
    const { checkResult: isNewTeamAlreadyInTheTournament, reason } =
      checkIfTeamOrPlayersAreAlreadyInTheTournament(newTeam, groupStageDraw.teams);

    if (isNewTeamAlreadyInTheTournament) {
      let toastMessage = undefined;
      switch (reason) {
        case "existingTeam":
          toastMessage = (
            <ErrorToastMessage>
              <div>
                Team&nbsp;<span className="font-medium">'{newTeam.name}'</span>&nbsp;is already in the
                tournament!
              </div>
            </ErrorToastMessage>
          );
          break;
        case "bothPlayersExisting":
          toastMessage = (
            <ErrorToastMessage>
              <div>
                Both &nbsp;<span className="font-medium">'{newTeam.players[0].name}'</span>
                &nbsp;and&nbsp;
                <span className="font-medium">'{newTeam.players[1].name}'</span>&nbsp;are already in the
                tournament!
              </div>
            </ErrorToastMessage>
          );
          break;
        case "existingPlayerOne":
          toastMessage = (
            <ErrorToastMessage>
              <div>
                Player&nbsp;<span className="font-medium">'{newTeam.players[0].name}'</span>&nbsp;is already
                in the tournament!
              </div>
            </ErrorToastMessage>
          );
          break;
        case "existingPlayerTwo":
          toastMessage = (
            <ErrorToastMessage>
              <div>
                Player&nbsp;<span className="font-medium">'{newTeam.players[1].name}'</span>&nbsp;is already
                in the tournament!
              </div>
            </ErrorToastMessage>
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

  const saveGroupStageDraw = async (): Promise<void> => {
    // TODO think about this function. Async operation is executed here but we are not waiting for the result...
    // what about errors ?
    fetch(
      `http://localhost:3001/groupstage-draws/${groupStageDrawId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupStageDraw),
      },
      () =>
        toast({
          description: <SuccessToastMessage>Changes successfuly saved!</SuccessToastMessage>,
        }),
      () =>
        toast({
          description: (
            <ErrorToastMessage>An unexpected error occured. Could not save changes.</ErrorToastMessage>
          ),
        })
    );
  };

  const teamsWithPoints = calculateSeedingPointsOfTeams(
    groupStageDraw.teams,
    groupStageDraw.category,
    groupStageDraw.divisions,
    groupStageDraw.teamPointsCountMethod,
    groupStageDraw.numberOfBestResultsCountedToPointsTotal
  );

  const tournamentDrawSettings = {
    category: groupStageDraw.category,
    divisions: groupStageDraw.divisions,
    groups: groupStageDraw.groups,
    name: groupStageDraw.name,
    powerpools: groupStageDraw.powerpools,
    powerpoolTeams: groupStageDraw.powerpoolTeams,
    teamCount: groupStageDraw.teams.length,
    teamPointsCountMethod: groupStageDraw.teamPointsCountMethod,
    numberOfBestResultsCountedToPointsTotal: groupStageDraw.numberOfBestResultsCountedToPointsTotal,
  };

  const drawnGroups = drawGroups(teamsWithPoints, {
    groups: groupStageDraw.groups,
    powerpools: groupStageDraw.powerpools,
    powerpoolTeams: groupStageDraw.powerpoolTeams,
  });

  return (
    <div className="w-full grid gap-y-10 lg:grid-rows-[minmax(0,auto)] grid-cols-1 lg:gap-x-8 xl:max-2xl:grid-cols-[1fr_1.35fr] 2xl:grid-cols-[1fr_1.6fr] min-[1920px]:grid-cols-[1fr_2fr]">
      <div className="row-start-1 row-end-2 xl:col-start-2 xl:col-end-3">
        <div className="flex flex-wrap items-center justify-between mb-10 gap-x-3 gap-y-4">
          <h1 className="font-semibold text-2xl">{groupStageDraw.name}</h1>
          <Button onClick={saveGroupStageDraw} disabled={saveInProgress}>
            {saveInProgress ? (
              <>
                <Loader2 className="w-6 animate-spin mr-2" /> Save changes
              </>
            ) : (
              <>
                <Save className="w-6 mr-2" />
                Save changes
              </>
            )}
          </Button>
        </div>
        <Settings
          groupStageDrawSettings={tournamentDrawSettings}
          setGroupStageDrawSettings={dispatch}
          setGroupStageDrawName={setGroupStageDrawName}
        />
      </div>
      <div className="row-start-2 row-end-3 xl:col-start-1 xl:col-end-2 xl:row-start-1 xl:row-end-3 flex flex-col">
        <div className="mb-5 flex flex-col gap-2 sm:max-xl:flex-row sm:max-xl:gap-0 xl:max-2xl:gap-2 2xl:flex-row 2xl:gap-0">
          <div className="flex items-center">
            <span className="title">Teams ({groupStageDraw.teams.length})</span>
            <Button
              onClick={() => dispatch({ type: groupStageDrawReducerActionType.Reset })}
              title="Delete all teams"
              variant="icon"
              size="icon_small"
              className="mx-2 hover:text-[hsl(var(--destructive))]"
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
              category={groupStageDraw.category}
              divisions={groupStageDraw.divisions}
            />
          </div>
        )}
        <Teams
          removeTeam={dispatch}
          teams={teamsWithPoints}
          teamPointsCountMethod={groupStageDraw.teamPointsCountMethod}
        />
      </div>
      <div className="row-start-3 row-end-4 xl:col-start-2 xl:col-end-3 xl:row-start-2 xl:row-end-3">
        <Groups
          teamCount={teamsWithPoints.length}
          groups={drawnGroups.groups}
          powerpools={drawnGroups.powerpools}
        />
      </div>
    </div>
  );
};

const newGroupStageDrawInitialState: GroupStageDrawDTO = {
  modified: 0,
  id: "",
  name: "",
  divisions: [],
  category: Category.Open,
  groups: 0,
  powerpools: 0,
  powerpoolTeams: 0,
  teamPointsCountMethod: "sumOfPlayersPoints",
  numberOfBestResultsCountedToPointsTotal: 3,
  teams: [],
};

const SuccessToastMessage: FC<PropsWithChildren> = ({ children }) => (
  <>
    <CircleCheck className="text-green-500 mr-3" />
    {children}
  </>
);
