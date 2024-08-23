import { Dispatch, SetStateAction } from "react";
import { GroupStageSettings } from "./TournamentDraw";
import { Button } from "@/components/ui/button";
import { TournamentDivisionDetails } from "./TournamentDrawSettings";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
    <>
      <section>
        <TournamentDivisionDetails setTournamentDrawSettingsHandler={() => {}} />
      </section>
      <section id="group-draw-settings" className="mb-4">
        <div className="title py-4">Group draw settings</div>
        <div id="group-draw-settings-form">
          <label htmlFor="powerpool-teams">Powerpool teams:</label>
          <Input
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
          />
          <Separator orientation="vertical" className="mx-2" />
          <label htmlFor="powerpool-groups">Powerpool groups:</label>
          <Input
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
          />
          <Separator orientation="vertical" className="mx-2" />
          <label htmlFor="groups">Groups:</label>
          <Input
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
          <Separator orientation="vertical" className="mx-4" />
          <Button
            variant="default"
            onClick={() => {
              drawGroupsHandler();
            }}
          >
            Draw groups
          </Button>
        </div>
      </section>
    </>
  );
};
