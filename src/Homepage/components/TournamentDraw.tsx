import { useState } from "react";
import { drawGroups } from "./drawGroups";
import { GroupDrawSettings } from "./GroupDrawSettings";
import { Groups } from "./Groups";
import { ParticipatingTeam } from "./types";
import "./TournamentDraw.css";

export type TournamentDrawSettings = {
  powerpoolGroups: string;
  powerpoolTeams: string;
  groups: string;
  groupDrawMethod: string;
};

export type TournamentDraw = {
  powerpools?: Array<Group>;
  groups?: Array<Group>;
};

export type Group = {
  teams: Array<ParticipatingTeam>;
};

const TournamentDrawSettingsDefault: TournamentDrawSettings = {
  groupDrawMethod: "snake",
  groups: "",
  powerpoolGroups: "",
  powerpoolTeams: "",
};

export const TournamentDraw = ({
  participatingTeams,
  importTeamsFromFwangoHandler,
}: {
  participatingTeams: Array<ParticipatingTeam>;
  importTeamsFromFwangoHandler: (value?: File) => void;
}) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [tournamentDrawSettings, setTournamentDrawSettings] = useState<TournamentDrawSettings>(
    TournamentDrawSettingsDefault
  );
  const [tournamentDraw, setTournamentDraw] = useState<TournamentDraw | undefined>(undefined);

  const drawGroupsHandler = (): void => {
    const drawnGroups = drawGroups(participatingTeams, tournamentDrawSettings);
    setTournamentDraw(drawnGroups);
  };

  return (
    <div className="tournament-draw-content">
      <div className="tournament-teams">
        <div className="import-teams">
          <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0])} />
          <button disabled={!file} onClick={() => importTeamsFromFwangoHandler(file)}>
            Import teams from Fwango
          </button>
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
