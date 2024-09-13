import { FC, useReducer, useState } from "react";
import { Loader2, SquarePlus } from "lucide-react";
import { useParams } from "@tanstack/react-router";
import "./TournamentDraw.css";
import { TournamentDrawSettings } from "./TournamentDrawSettings";
import { Groups } from "./Groups";
import { drawGroups } from "./drawGroups";
import { fetchRankedTeams } from "./fetchRankedTeams";
import { fetchAllRankedPlayers } from "./fetchRankedPlayers";
import { Button } from "@/components/ui/button";
import { AddTeam } from "./AddTeam";
import {
  RankedPlayerDTO,
  RankedTeamDTO,
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

  const importTeamsFromFwango = async (e: React.ChangeEvent<HTMLInputElement>) => {
    alert("importing same file again, yay!");
    const importedTeamsFile = e.target.files?.[0];
    // setChosenFileName(importedTeamsFile?.name ?? "");
    const rankedTeams = await fetchRankedTeams(tournamentDraw.category);
    const rankedPlayers = await fetchAllRankedPlayers(tournamentDraw.category);
    if (importedTeamsFile) {
      // solve case where number of substring split by coma is not divisible by 3 -
      // team name or player's name is missing for some reason
      const importedTeamsFileContents = await importedTeamsFile.text();
      const importedTeamsCsvRows = importedTeamsFileContents.trim().split(/[\n]/);
      const importedTeams: Array<{ name: string; playerOne: string; playerTwo: string }> = [];
      for (const row of importedTeamsCsvRows) {
        const importedTeam = row.split(",");
        importedTeams.push({
          name: importedTeam[0].trim(),
          playerOne: importedTeam[1].trim(),
          playerTwo: importedTeam[2].trim(),
        });
      }
      const teams: Array<TournamentDrawTeamWithPoints> = createTournamentTeamsFromImportedData(
        importedTeams,
        rankedTeams,
        rankedPlayers,
        tournamentDraw.numberOfResultsCountedToPointsTotal,
        tournamentDraw.teamPointsCountMethod
      );

      dispatch({ type: TournamentDrawReducerActionType.SetTeams, teams: teams });
    } else {
      console.log("file not specified, cannot import teams");
    }
  };

  const addTeam = (team: TournamentDrawTeamDTO): void => {
    dispatch({ type: TournamentDrawReducerActionType.AddTeam, team });
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
    // setChosenFileName("No file chosen");
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

  const createNewTournament = async (): Promise<void> => {
    // setTournamentDraws([{ id: "newId", name: "new tournament 1", tournamentDraws: [] }, ...tournamentDraws]);
  };

  const teamsWithPoints = sortTeamsByPoints(
    tournamentDraw.teams,
    tournamentDraw.teamPointsCountMethod,
    tournamentDraw.numberOfResultsCountedToPointsTotal
  );

  return (
    <section id="tournament-draw">
      <div id="tournament-draws">
        <p className="title pb-6 pt-2 text-center text-white">Tournaments</p>
        <Button variant="outline" className="w-full mb-2 py-1.5 px-3" onClick={createNewTournament}>
          <SquarePlus className="mr-2" /> Create new
        </Button>
        {tournamentDraws?.map((t) => (
          <div key={t.id} id="tournament-draw-item">
            <div id="tournament-draw-name">{t.name}</div>
          </div>
        ))}
      </div>
      <div id="group-stage-draw">
        <div id="tournament-teams">
          <Button
            variant="destructive"
            className="mb-2"
            onClick={() => {
              resetTournament();
            }}
          >
            Reset
          </Button>
          <Button
            className="mb-2 ml-2"
            onClick={() => {
              saveTournamentDraw();
            }}
            disabled={saveInProgress}
          >
            {saveInProgress ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Save
              </>
            ) : (
              "Save"
            )}
          </Button>
          <div className="import-teams mb-2">
            <input
              id="import-teams"
              type="file"
              accept=".csv"
              onChange={(e) => importTeamsFromFwango(e)}
              hidden
            />
            <label htmlFor="import-teams">Import teams from Fwango</label>
            {/* <span>{chosenFileName}</span> */}
          </div>
          <AddTeam addTeamHandler={addTeam} category={tournamentDraw.category} />
          <div>
            <p className="title py-4">Teams ({tournamentDraw.teams.length})</p>
            <Teams
              removeTeam={dispatch}
              teams={teamsWithPoints}
              teamPointsCountMethod={tournamentDraw.teamPointsCountMethod}
            />
          </div>
        </div>
        <div className="group-draw">
          <TournamentDrawSettings
            tournamentDrawSettings={tournamentDraw}
            setTournamentDrawSettings={dispatch}
            drawGroupsHandler={drawGroupsHandler}
          />
          <Groups groups={groupStage?.groups} powerpools={groupStage?.powerpools} />
        </div>
      </div>
    </section>
  );
};

const createTournamentTeamsFromImportedData = (
  importedTeams: { name: string; playerOne: string; playerTwo: string }[],
  rankedTeams: Array<RankedTeamDTO>,
  rankedPlayers: Array<RankedPlayerDTO>,
  numberOfResultsCountedToPointsTotal: number,
  teamPointsCountMethod: TeamPointsCountMethod
): Array<TournamentDrawTeamWithPoints> => {
  const _tournamentTeams: Array<TournamentDrawTeamWithPoints> = [];

  for (const importedTeam of importedTeams) {
    const existingTeam = rankedTeams.find(
      (rankedTeam) =>
        rankedTeam.name === importedTeam.name &&
        rankedTeam.players.find((rankedTeamPlayer) => rankedTeamPlayer.name === importedTeam.playerOne) &&
        rankedTeam.players.find((rankedTeamPlayer) => rankedTeamPlayer.name === importedTeam.playerTwo)
    );

    const existingPlayerOne = rankedPlayers.find(
      (rankedPlayer) => rankedPlayer.name === importedTeam.playerOne
    );
    const existingPlayerTwo = rankedPlayers.find(
      (rankedPlayer) => rankedPlayer.name === importedTeam.playerTwo
    );

    // TODO fix scenario when existingTeam is not found, because the team name is not found in the repository.
    // Players changed their team name or there is a typo, but the actual players from that team already played
    // together under a different name. User should be notified on UI about this discrepancy and should be able
    // to change the team name for all existing records in the db or do smth else....
    if (existingTeam) {
      if (existingPlayerOne && existingPlayerTwo) {
        const existingPlayerOnePoints =
          teamPointsCountMethod === "sumOfPlayersPoints"
            ? getTotalPointsFromXBestResults(
                existingPlayerOne.tournamentResults,
                numberOfResultsCountedToPointsTotal
              )
            : 0;

        const existingPlayerTwoPoints =
          teamPointsCountMethod === "sumOfPlayersPoints"
            ? getTotalPointsFromXBestResults(
                existingPlayerTwo.tournamentResults,
                numberOfResultsCountedToPointsTotal
              )
            : 0;

        _tournamentTeams.push({
          id: existingTeam.id,
          uid: existingTeam.uid,
          name: existingTeam.name,
          tournamentResults: existingTeam.tournamentResults,
          players: [
            {
              ...existingPlayerOne,
              points: existingPlayerOnePoints,
            },
            {
              ...existingPlayerTwo,
              points: existingPlayerTwoPoints,
            },
          ],
          points:
            teamPointsCountMethod === "sumOfPlayersPoints"
              ? existingPlayerOnePoints + existingPlayerTwoPoints
              : getTotalPointsFromXBestResults(
                  existingTeam.tournamentResults,
                  numberOfResultsCountedToPointsTotal
                ),
        });
        continue; // team is found in the ranked teams, take the next team
      }
    }

    // team is not found in the ranked teams, it is a new team.
    // But both or one of the players might be ranked so we need check that
    _tournamentTeams.push({
      id: null,
      uid: null,
      name: importedTeam.name,
      tournamentResults: [],
      players: [
        existingPlayerOne
          ? {
              ...existingPlayerOne,
              points:
                teamPointsCountMethod === "sumOfPlayersPoints"
                  ? getTotalPointsFromXBestResults(
                      existingPlayerOne.tournamentResults,
                      numberOfResultsCountedToPointsTotal
                    )
                  : 0,
            }
          : {
              name: importedTeam.playerOne,
              id: null,
              uid: null,
              tournamentResults: [],
              points: 0,
            },
        existingPlayerTwo
          ? {
              ...existingPlayerTwo,
              points:
                teamPointsCountMethod === "sumOfPlayersPoints"
                  ? getTotalPointsFromXBestResults(
                      existingPlayerTwo.tournamentResults,
                      numberOfResultsCountedToPointsTotal
                    )
                  : 0,
            }
          : {
              name: importedTeam.playerTwo,
              id: null,
              uid: null,
              tournamentResults: [],
              points: 0,
            },
      ],
      points:
        teamPointsCountMethod === "sumOfPlayersPoints"
          ? (existingPlayerOne
              ? getTotalPointsFromXBestResults(
                  existingPlayerOne.tournamentResults,
                  numberOfResultsCountedToPointsTotal
                )
              : 0) +
            (existingPlayerTwo
              ? getTotalPointsFromXBestResults(
                  existingPlayerTwo.tournamentResults,
                  numberOfResultsCountedToPointsTotal
                )
              : 0)
          : 0,
    });
  }
  return _tournamentTeams;
};

export type GroupStage = {
  powerpools?: Array<Group>;
  groups?: Array<Group>;
};

export type Group = {
  teams: Array<TournamentDrawTeamWithPoints>;
};

// TODO improve this type with never. There are 2 options - either we count player points
// in which case team points is sum of the player points
// or we count team points in which case players have no points
export type TournamentDrawTeamWithPoints = Pick<
  TournamentDrawTeamDTO,
  "id" | "uid" | "name" | "tournamentResults"
> & {
  points: number;
  players: Array<TournamentDrawPlayerDTO & { points: number }>;
};

const sortTeamsByPoints = (
  data: Array<TournamentDrawTeamDTO> | undefined,
  teamPointsCountMethod: TeamPointsCountMethod,
  numberOfResultsCountedToPointsTotal: number
): Array<TournamentDrawTeamWithPoints> => {
  console.log("augmenting teams from state with 'points' property and sorting the list of teams");

  return teamPointsCountMethod === "sumOfTeamPoints"
    ? data
        ?.map<TournamentDrawTeamWithPoints>((team) => ({
          ...team,
          players: team.players.map((player) => ({ ...player, points: 0 })),
          points: getTotalPointsFromXBestResults(team.tournamentResults, numberOfResultsCountedToPointsTotal),
        }))
        .sort((teamA, teamB) => teamB.points - teamA.points) ?? []
    : data
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
