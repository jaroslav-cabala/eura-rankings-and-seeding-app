import { Dispatch, SetStateAction } from "react";
import { GroupStageSettings } from "./GroupStage";
import "./GroupStage.css";

export const GroupDrawSettings = ({
  tournamentDrawSettings,
  setTournamentDrawSettings,
  drawGroupsHandler,
}: {
  setTournamentDrawSettings: Dispatch<SetStateAction<GroupStageSettings>>;
  tournamentDrawSettings: GroupStageSettings;
  drawGroupsHandler: () => void;
}) => {
  return (
    <section className="group-draw-settings">
      <div className="title">Tournament draw settings</div>
      <div className="powerpools">
        <label htmlFor="powerpools">Powerpools</label>
        <input
          id="powerpools"
          type="checkbox"
          checked={tournamentDrawSettings.powerpools}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTournamentDrawSettings((prevVal) => ({
              ...prevVal,
              powerpools: event.target.checked,
            }));
          }}
        />
        <label className={!tournamentDrawSettings.powerpools ? "grey-color" : ""} htmlFor="powerpool-teams">
          Powerpool teams
        </label>
        <input
          id="powerpool-teams"
          type="number"
          min={1}
          value={tournamentDrawSettings.powerpoolTeams}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTournamentDrawSettings((prevVal) => ({
              ...prevVal,
              powerpoolTeams: event.target.value,
            }));
          }}
          disabled={!tournamentDrawSettings.powerpools}
        />
        <label className={!tournamentDrawSettings.powerpools ? "grey-color" : ""} htmlFor="powerpool-groups">
          Powerpool groups
        </label>
        <input
          id="powerpool-groups"
          type="number"
          min={1}
          value={tournamentDrawSettings.powerpoolGroups}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTournamentDrawSettings((prevVal) => ({
              ...prevVal,
              powerpoolGroups: event.target.value,
            }));
          }}
          disabled={!tournamentDrawSettings.powerpools}
        />
      </div>
      <div>
        <label htmlFor="groups">Groups</label>
        <input
          id="groups"
          type="number"
          min={1}
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
