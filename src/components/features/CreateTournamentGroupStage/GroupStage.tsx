import React, { useState } from "react";
import { drawGroups } from "./drawGroups";
import { GroupDrawSettings } from "./GroupDrawSettings";
import { Groups } from "./Groups";
import { ParticipatingTeam } from "../types";
import "./GroupStage.css";

export type GroupStageSettings = {
  powerpools: boolean;
  powerpoolGroups: string;
  powerpoolTeams: string;
  groups: string;
  groupDrawMethod: "snake";
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
  powerpoolGroups: "",
  powerpoolTeams: "",
  groups: "",
  groupDrawMethod: "snake",
};

export const GroupStage = ({
  participatingTeams,
  importTeamsFromFwangoHandler,
  resetTournamentHandler,
}: {
  participatingTeams: Array<ParticipatingTeam>;
  importTeamsFromFwangoHandler: (value?: File) => void;
  resetTournamentHandler: () => void;
}) => {
  const [chosenFileName, setChosenFileName] = useState("No file chosen");
  const [groupStageSettings, setGroupStageSettings] = useState<GroupStageSettings>({
    ...groupStageSettingsDefault,
    groups: (participatingTeams.length / 4).toString(), // set default number of groups based on the number of teams
  });
  const [groupStage, setGroupStage] = useState<GroupStage | undefined>(undefined);

  const drawGroupsHandler = (): void => {
    const drawnGroups = drawGroups(participatingTeams, groupStageSettings);
    setGroupStage(drawnGroups);
  };

  const importTeamsFromFwango = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setChosenFileName(file?.name ?? "");
    importTeamsFromFwangoHandler(file);
  };

  const resetTournament = (): void => {
    setChosenFileName("No file chosen");
    setGroupStageSettings({ ...groupStageSettingsDefault });
    resetTournamentHandler();
  };

  return (
    <div className="tournament-draw-content">
      <div className="tournament-teams">
        <button
          id="reset-btn"
          onClick={() => {
            resetTournament();
          }}
        >
          Reset
        </button>
        <div className="import-teams">
          <input
            id="upload-teams"
            type="file"
            accept=".csv"
            onChange={(e) => importTeamsFromFwango(e)}
            hidden
          />
          <label htmlFor="upload-teams">Import teams from Fwango</label>
          <span>{chosenFileName}</span>
        </div>
        <div>
          <p className="title">Teams {participatingTeams.length}</p>
          <ol>
            {participatingTeams
              .slice()
              .sort((a, b) => b.points - a.points)
              .map((team) => (
                <li key={team.id ?? `${team.playerOne.name}_${team.playerTwo.name}`}>
                  <div className="team-name">{`${team.name} ${team.points}`}</div>
                  <div className="team-players">{`${team.playerOne.name}, ${team.playerTwo.name}`}</div>
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
    </div>
  );
};
