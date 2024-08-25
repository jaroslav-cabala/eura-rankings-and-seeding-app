import { FC, useState } from "react";
import "./TournamentDraw.css";
import { ParticipatingTeam } from "../types";
import { TournamentDrawSettings } from "./GroupDrawSettings";
import { Groups } from "./Groups";
import { drawGroups } from "./drawGroups";
import { GroupDrawMethod, tournamentDrawDefaults } from "@/config";
import { fetchTeams, RankedTeams } from "./fetchTeams";
import { fetchPlayers, RankedPlayers } from "./fetchPlayers";
import { Button } from "@/components/ui/button";
import { AddTeam } from "./AddTeam";
import { Loader2, SquarePlus, Trash2 } from "lucide-react";
import { participatingTeamsMock, tournamentsMock } from "./testData";
import { TournamentDrawDTO } from "@/api/apiTypes";
import { useGetTournamentDraw } from "@/api/useGetTournamentDraw";
import { useParams } from "@tanstack/react-router";

export const TournamentDraw = () => {
  const params = useParams({ from: "/tournament-draws/$tournamentDrawId" });
  const { data, loading, error } = useGetTournamentDraw(params.tournamentDrawId);

  if (error) {
    return (
      <section id="fullscreen-section">
        <div className="py-2">Error while fetching tournament draw data</div>
      </section>
    );
  }

  if (loading) {
    return (
      <section>
        <div className="py-2">
          <Loader2 className="animate-spin mr-2" />
          Loading tournament data...
        </div>
      </section>
    );
  }

  return <TournamentDrawComponent data={data} loading={loading} />;
};

type TournamentDrawComponentProps = {
  data?: TournamentDrawDTO;
  loading: boolean;
};

const TournamentDrawComponent: FC<TournamentDrawComponentProps> = ({ data, loading }) => {
  const [tournaments, setTournaments] = useState<Array<Tournament>>(tournamentsMock);
  const [participatingTeams, setParticipatingTeams] =
    useState<Array<ParticipatingTeam>>(participatingTeamsMock);
  // const [chosenFileName, setChosenFileName] = useState("No file chosen");
  const [groupStageSettings, setGroupStageSettings] = useState<GroupStageSettings>({
    ...groupStageSettingsDefault,
    groups: (participatingTeams.length / 4).toString(), // set default number of groups based on the number of teams
  });
  const [groupStage, setGroupStage] = useState<GroupStage | undefined>(undefined);

  const drawGroupsHandler = (): void => {
    const drawnGroups = drawGroups(participatingTeams, groupStageSettings);
    setGroupStage(drawnGroups);
  };

  const importTeamsFromFwango = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const importedTeamsFile = e.target.files?.[0];
    // setChosenFileName(importedTeamsFile?.name ?? "");

    const rankedTeams = await fetchTeams();
    const rankedPlayers = await fetchPlayers();

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

      const _participatingTeams: Array<ParticipatingTeam> = createParticipatingTeamsFromImportedData(
        importedTeams,
        rankedTeams,
        rankedPlayers
      );

      setParticipatingTeams(_participatingTeams);
    } else {
      console.log("file not specified, cannot import teams");
    }
  };

  const resetTournament = (): void => {
    // setChosenFileName("No file chosen");
    setGroupStageSettings({ ...groupStageSettingsDefault });
    setGroupStage({});
    setParticipatingTeams([]);
  };

  const createNewTournament = (): void => {
    setTournaments([{ id: "newId", name: "new tournament 1", tournamentDraws: [] }, ...tournaments]);
  };

  return (
    <section id="tournament-draw">
      <div id="tournament-draws">
        <p className="title pb-6 pt-2 text-white">Tournaments</p>
        <Button variant="outline" className="w-full mb-2 py-1.5 px-3" onClick={createNewTournament}>
          <SquarePlus className="mr-2" /> Create new
        </Button>
        {tournaments.map((t) => (
          <div id="tournament-draw-item">
            <div key={t.id} id="tournament-draw-name">
              {t.name}
            </div>
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
            // onClick={() => {
            //   saveTournamentDraw();
            // }}
          >
            Save
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
          <AddTeam
            addTeamHandler={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
          <div>
            <p className="title py-4">Teams ({participatingTeams.length})</p>
            <ol>
              {participatingTeams
                .slice()
                .sort((a, b) => b.points - a.points)
                .map((team) => (
                  <li key={team.id ?? `${team.playerOne.name}_${team.playerTwo.name}`}>
                    <div id="team-info">
                      <div className="team-name">{`${team.name} (${team.points} points)`}</div>
                      <div className="team-players">
                        {`${team.playerOne.name} (${team.playerOne.points}), ${team.playerTwo.name} (${team.playerTwo.points})`}
                      </div>
                    </div>
                    <div id="team-actions">
                      <Button title="Delete team" size="icon" variant="icon" className="hover:text-red-500">
                        <Trash2 />
                      </Button>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </div>
        <div className="group-draw">
          <TournamentDrawSettings
            tournamentDrawSettings={groupStageSettings}
            setTournamentDrawSettings={setGroupStageSettings}
            drawGroupsHandler={drawGroupsHandler}
          />
          <Groups groups={groupStage?.groups} powerpools={groupStage?.powerpools} />
        </div>
      </div>
    </section>
  );
};

const createParticipatingTeamsFromImportedData = (
  importedTeams: { name: string; playerOne: string; playerTwo: string }[],
  rankedTeams: RankedTeams,
  rankedPlayers: RankedPlayers
) => {
  const _participatingTeams: Array<ParticipatingTeam> = [];
  for (const importedTeam of importedTeams) {
    const existingTeam = rankedTeams.find(
      (team) =>
        team.name === importedTeam.name &&
        (team.playerOne.name === importedTeam.playerOne || team.playerOne.name === importedTeam.playerTwo) &&
        (team.playerTwo.name === importedTeam.playerOne || team.playerTwo.name === importedTeam.playerTwo)
    );

    if (existingTeam) {
      const existingPlayerOne = rankedPlayers.find((player) => player.name === importedTeam.playerOne);
      const existingPlayerTwo = rankedPlayers.find((player) => player.name === importedTeam.playerTwo);

      _participatingTeams.push({
        id: existingTeam.teamUid,
        name: existingTeam.name,
        playerOne: { ...existingTeam.playerOne, points: existingPlayerOne?.points ?? 0 },
        playerTwo: { ...existingTeam.playerTwo, points: existingPlayerTwo?.points ?? 0 },
        points: (existingPlayerOne?.points ?? 0) + (existingPlayerTwo?.points ?? 0),
      });
      continue; // team is found in the ranked teams, take the next team
    }

    // team is not found in the ranked teams, it is a new team.
    // But the players might be ranked so we need to look for them
    const existingPlayerOne = rankedPlayers.find((player) => player.name === importedTeam.playerOne);
    const existingPlayerTwo = rankedPlayers.find((player) => player.name === importedTeam.playerTwo);

    _participatingTeams.push({
      name: importedTeam.name,
      playerOne: existingPlayerOne
        ? {
            name: existingPlayerOne.name,
            id: existingPlayerOne.playerId,
            uid: existingPlayerOne.playerUid,
            points: existingPlayerOne.points,
          }
        : { name: importedTeam.playerOne, id: "", uid: "", points: 0 },
      playerTwo: existingPlayerTwo
        ? {
            name: existingPlayerTwo.name,
            id: existingPlayerTwo.playerId,
            uid: existingPlayerTwo.playerUid,
            points: existingPlayerTwo.points,
          }
        : { name: importedTeam.playerTwo, id: "", uid: "", points: 0 },
      points: (existingPlayerOne?.points ?? 0) + (existingPlayerTwo?.points ?? 0),
    });
  }
  return _participatingTeams;
};

export type GroupStageSettings = {
  powerpools: boolean;
  powerpoolGroups: string;
  powerpoolTeams: string;
  groups: string;
  groupDrawMethod: GroupDrawMethod;
};

export type GroupStage = {
  powerpools?: Array<Group>;
  groups?: Array<Group>;
};

export type Group = {
  teams: Array<ParticipatingTeam>;
};

const groupStageSettingsDefault: GroupStageSettings = {
  powerpools: false,
  powerpoolGroups: "0",
  powerpoolTeams: "0",
  groups: "0",
  groupDrawMethod: tournamentDrawDefaults.groupDrawMethod,
};

type Tournament = {
  id: string;
  name: string;
  tournamentDraws: Array<{ id: string; name: string }>;
};
