import { useState } from "react";
import "./TournamentDraw.css";
import { ParticipatingTeam } from "../types";
import { GroupDrawSettings } from "./GroupDrawSettings";
import { Groups } from "./Groups";
import { drawGroups } from "./drawGroups";
import { GroupDrawMethod, tournamentDrawDefaults } from "@/config";
import { testData } from "./testData";
import { fetchTeams } from "./fetchTeams";
import { fetchPlayers } from "./fetchPlayers";
import { Button } from "@/components/ui/button";
import { AddTeam } from "./AddTeam";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

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

export const TournamentDraw = () => {
  const [participatingTeams, setParticipatingTeams] = useState<Array<ParticipatingTeam>>(testData);
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

      const _participatingTeams: Array<ParticipatingTeam> = [];
      for (const importedTeam of importedTeams) {
        const existingTeam = rankedTeams.find(
          (team) =>
            team.name === importedTeam.name &&
            (team.playerOne.name === importedTeam.playerOne ||
              team.playerOne.name === importedTeam.playerTwo) &&
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

  // const addTeamToTheTournament = (
  //   teamName: string,
  //   playerOne: Player,
  //   playerTwo: Player,
  //   points: number,
  //   teamId?: string
  // ): void => {
  //   setParticipatingTeams((teams) => [
  //     ...teams,
  //     { id: teamId, name: teamName, playerOne, playerTwo, points },
  //   ]);
  // };

  return (
    <section id="tournament-draw-content">
      <section id="tournament-draws">
        <Input placeholder="Tournament name" />
        <Button className="">Create tournament</Button>
        <p className="title py-4">Tournaments</p>
        <div id="tournament-name">ETS Barcelona</div>
        <div id="tournament-name">ETS Bologna</div>
        <div id="tournament-name">ETS Leuven</div>
        <div id="tournament-name">ETS Bern</div>
        <div id="tournament-name">ETS Helsinki</div>
      </section>
      <section className="tournament-draw">
        <div className="tournament-teams">
          <Button
            variant="destructive"
            className="mb-2"
            onClick={() => {
              resetTournament();
            }}
          >
            Reset
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
          <GroupDrawSettings
            tournamentDrawSettings={groupStageSettings}
            setTournamentDrawSettings={setGroupStageSettings}
            drawGroupsHandler={drawGroupsHandler}
          />
          <Groups groups={groupStage?.groups} powerpools={groupStage?.powerpools} />
        </div>
      </section>
    </section>
  );
};
