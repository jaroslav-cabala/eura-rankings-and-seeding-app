import React, { useState } from "react";
import { drawGroups } from "./drawGroups";
import { GroupDrawSettings } from "./GroupDrawSettings";
import { Groups } from "./Groups";
import { ParticipatingTeam } from "./types";
import "./TournamentDraw.css";

export type TournamentDrawSettings = {
  powerpools: boolean;
  powerpoolGroups: string;
  powerpoolTeams: string;
  groups: string;
  groupDrawMethod: "snake";
};

export type TournamentDraw = {
  powerpools?: Array<Group>;
  groups?: Array<Group>;
};

export type Group = {
  teams: Array<ParticipatingTeam>;
};

const tournamentDrawSettingsDefault: TournamentDrawSettings = {
  powerpools: false,
  powerpoolGroups: "",
  powerpoolTeams: "",
  groups: "",
  groupDrawMethod: "snake",
};

export const TournamentDraw = ({
  participatingTeams,
  importTeamsFromFwangoHandler,
  resetTournamentHandler,
}: {
  participatingTeams: Array<ParticipatingTeam>;
  importTeamsFromFwangoHandler: (value?: File) => void;
  resetTournamentHandler: () => void;
}) => {
  const [chosenFileName, setChosenFileName] = useState("No file chosen");
  const [tournamentDrawSettings, setTournamentDrawSettings] = useState<TournamentDrawSettings>({
    ...tournamentDrawSettingsDefault,
    groups: (participatingTeams.length / 4).toString(), // set default number of groups based on the number of teams
  });
  const [tournamentDraw, setTournamentDraw] = useState<TournamentDraw | undefined>(undefined);

  const drawGroupsHandler = (): void => {
    const drawnGroups = drawGroups(participatingTeams, tournamentDrawSettings);
    setTournamentDraw(drawnGroups);
  };

  const importTeamsFromFwango = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setChosenFileName(file?.name ?? "");
    importTeamsFromFwangoHandler(file);
  };

  const resetTournament = (): void => {
    setChosenFileName("No file chosen");
    setTournamentDrawSettings({ ...tournamentDrawSettingsDefault });
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
          tournamentDrawSettings={tournamentDrawSettings}
          setTournamentDrawSettings={setTournamentDrawSettings}
          drawGroupsHandler={drawGroupsHandler}
        />
        <Groups groups={tournamentDraw?.groups} powerpools={tournamentDraw?.powerpools} />
      </div>
    </div>
  );
};
