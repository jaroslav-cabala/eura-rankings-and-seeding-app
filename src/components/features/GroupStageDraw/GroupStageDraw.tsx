import { FC, useMemo, useReducer, useState } from "react";
import { ChevronsDown, ChevronsRight, Import, Loader2, Save, Trash2 } from "lucide-react";
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
import { calculateSeedingPointsOfTeams } from "./calculateSeedingPointsOfTeams";
import { checkIfTeamOrPlayersAreAlreadyInTheTournament } from "./checkIfTeamOrPlayersAreAlreadyInTheTournament";
import { ErrorToastMessage } from "../../common/ErrorToastMessage";
import { useGroupStageDrawMenuContext } from "./GroupStageDrawMenu/GroupStageDrawMenuContext";
import { determineWhetherTeamBelongsInTheSelectedCategoryAndDivision } from "./determineWheterTeamsBelonginTheSelectedCategoryandDivision";
import { SuccessToastMessage } from "@/components/common/SuccessToastMessage";
import "./GroupStageDraw.css";

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
  console.log("GroupStageDraw component");
  const { menuItems, setMenuItems } = useGroupStageDrawMenuContext();
  const [groupStageDraw, dispatch] = useReducer(
    groupStageDrawReducer,
    groupStageDrawInitialState ?? newGroupStageDrawInitialState
  );
  const [addTeamFormVisible, setAddTeamFormVisible] = useState(false);
  const { fetch, loading: saveInProgress } = useFetchLazy<boolean>();
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
    // strip groupStageDraw object; that is sent in the request body; of unnecessary properties(tournament results)
    const data = {
      ...groupStageDraw,
      teams: groupStageDraw.teams.map((team) => ({
        name: team.name,
        uid: team.uid,
        players: team.players.map((player) => ({ name: player.name, uid: player.uid })),
      })),
    };

    // TODO think about this function. Async operation is executed here but we are not waiting for the result...
    // what about errors ?
    fetch({
      fetchUrl: `http://localhost:3001/groupstage-draws/${groupStageDrawId}`,
      requestInit: {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      onSuccessAction: () => {
        const newMenuItems = menuItems
          .filter((menuItem) => menuItem.id !== groupStageDraw.id)
          .concat([
            {
              id: groupStageDraw.id,
              name: groupStageDraw.name,
              modified: groupStageDraw.modified,
            },
          ]);
        setMenuItems(newMenuItems);
        toast({
          description: <SuccessToastMessage>Changes successfuly saved!</SuccessToastMessage>,
        });
      },
      onErrorAction: () =>
        toast({
          description: (
            <ErrorToastMessage>An unexpected error occured. Could not save changes.</ErrorToastMessage>
          ),
        }),
    });
  };

  const groupStageDrawTeams: Array<GroupStageDrawTeam> = useMemo(
    () =>
      groupStageDraw.teams.map((team) => ({
        ...team,
        belongsInTheSelectedCategory: true,
        points: 0,
        players: team.players.map((player) => ({ ...player, points: 0 })),
      })),
    [groupStageDraw.teams]
  );

  // const flaggedTeams = useMemo(
  //   () =>
  //     determineWhetherTeamBelongsInTheSelectedCategoryAndDivision(
  //       groupStageDrawTeams,
  //       groupStageDraw.category,
  //       groupStageDraw.divisions
  //     ),
  //   [groupStageDraw.category, groupStageDraw.divisions, groupStageDrawTeams]
  // );

  // const teamsWithPoints = useMemo(
  //   () =>
  //     calculateSeedingPointsOfTeams(
  //       flaggedTeams,
  //       groupStageDraw.category,
  //       groupStageDraw.divisions,
  //       groupStageDraw.teamPointsCountMethod,
  //       groupStageDraw.numberOfBestResultsCountedToPointsTotal
  //     ),
  //   [
  //     flaggedTeams,
  //     groupStageDraw.category,
  //     groupStageDraw.divisions,
  //     groupStageDraw.numberOfBestResultsCountedToPointsTotal,
  //     groupStageDraw.teamPointsCountMethod,
  //   ]
  // );

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

  const drawnGroups = drawGroups(groupStageDrawTeams, {
    groups: groupStageDraw.groups,
    powerpools: groupStageDraw.powerpools,
    powerpoolTeams: groupStageDraw.powerpoolTeams,
  });

  return (
    <div className="w-full grid gap-y-10 lg:grid-rows-[minmax(0,auto)] grid-cols-1 lg:gap-x-8 xl:max-2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)] min-[1920px]:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
      <div className="row-start-1 row-end-2 xl:col-start-2 xl:col-end-3">
        <div className="flex flex-wrap items-center justify-between mb-10 gap-x-3 gap-y-4">
          <h1 className="font-semibold text-2xl overflow">{groupStageDraw.name}</h1>
          <Button className="shadow-sm" onClick={saveGroupStageDraw} disabled={saveInProgress}>
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
        <Settings groupStageDrawSettings={tournamentDrawSettings} setGroupStageDrawSettings={dispatch} />
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
              className="ml-1 mr-2 hover:text-[hsl(var(--destructive))]"
            >
              <Trash2 />
            </Button>
          </div>
          <div className="flex justify-between sm:gap-1 sm:ml-auto xl:ml-0 2xl:ml-auto">
            <Button
              variant="ghost"
              className="pr-3 pl-1"
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
              <label htmlFor="import-teams" className="cursor-pointer mr-0 shadow-sm">
                <Import className="w-6 mr-2" />
                Import teams
              </label>
            </Button>
          </div>
        </div>
        {/* {addTeamFormVisible && (
          <div className="mb-6">
            <AddTeam
              addTeamHandler={addTeam}
              category={groupStageDraw.category}
              divisions={groupStageDraw.divisions}
            />
          </div>
        )} */}
        <Teams
          removeTeam={dispatch}
          teams={groupStageDrawTeams}
          teamPointsCountMethod={groupStageDraw.teamPointsCountMethod}
        />
      </div>
      <div className="row-start-3 row-end-4 xl:col-start-2 xl:col-end-3 xl:row-start-2 xl:row-end-3">
        <Groups
          teamCount={groupStageDrawTeams.length}
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
  category: { id: 1, name: Category.Open },
  groups: 0,
  powerpools: 0,
  powerpoolTeams: 0,
  teamPointsCountMethod: "sumOfPlayersPoints",
  numberOfBestResultsCountedToPointsTotal: 3,
  teams: [],
};
