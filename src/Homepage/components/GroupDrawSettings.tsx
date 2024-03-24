import { Dispatch, SetStateAction, useState } from "react";
import { TournamentDrawSettings } from "./TournamentDraw";
import "./TournamentDraw.css";

export const GroupDrawSettings = ({
  tournamentDrawSettings,
  setTournamentDrawSettings,
  drawGroupsHandler,
}: {
  setTournamentDrawSettings: Dispatch<SetStateAction<TournamentDrawSettings>>;
  tournamentDrawSettings: TournamentDrawSettings;
  drawGroupsHandler: () => void;
}) => {
  const [powerpools, setPowerpools] = useState<boolean>(false);

  return (
    <section className="group-draw-settings">
      <div className="title">Tournament draw settings</div>
      <div className="powerpools">
        <label htmlFor="powerpools">Powerpools</label>
        <input
          id="powerpools"
          type="checkbox"
          checked={powerpools}
          onChange={(e) => setPowerpools(e.target.checked)}
        />
        <label className={!powerpools ? "grey-color" : ""} htmlFor="powerpool-teams">
          Powerpool teams
        </label>
        <input
          id="powerpool-teams"
          value={tournamentDrawSettings.powerpoolTeams}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTournamentDrawSettings((prevVal) => ({
              ...prevVal,
              powerpoolTeams: event.target.value,
            }));
          }}
          disabled={!powerpools}
        />
        <label className={!powerpools ? "grey-color" : ""} htmlFor="powerpool-groups">
          Powerpool groups
        </label>
        <input
          id="powerpool-groups"
          value={tournamentDrawSettings.powerpoolGroups}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTournamentDrawSettings((prevVal) => ({
              ...prevVal,
              powerpoolGroups: event.target.value,
            }));
          }}
          disabled={!powerpools}
        />
      </div>
      <div>
        <label htmlFor="groups">Groups</label>
        <input
          id="groups"
          value={tournamentDrawSettings.groups}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTournamentDrawSettings((prevVal) => ({
              ...prevVal,
              groups: event.target.value,
            }));
          }}
        />
      </div>
      <div className="draw-groupstage">
        <button
          onClick={() => {
            drawGroupsHandler();
          }}
        >
          Draw group stage
        </button>
      </div>
    </section>
  );
};
