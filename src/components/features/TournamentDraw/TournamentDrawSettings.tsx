import { Dispatch } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/domain";
import { capitalizeFirstChar } from "@/utils";
import { TournamentDrawDTO } from "@/api/apiTypes";
import { TournamentDrawReducerActionType, TournamentDrawReducerActionTypes } from "./tournamentDrawReducer";

type TournamentDrawSettingsProps = {
  setTournamentDrawSettings: Dispatch<TournamentDrawReducerActionTypes>;
  tournamentDrawSettings: Pick<
    TournamentDrawDTO,
    "name" | "powerpoolTeams" | "powerpools" | "groups" | "teamPointsCountMethod" | "category"
  >;
  drawGroupsHandler: () => void;
};
export const TournamentDrawSettings: React.FC<TournamentDrawSettingsProps> = ({
  tournamentDrawSettings,
  setTournamentDrawSettings,
  drawGroupsHandler,
}) => {
  return (
    <div id="tournament-draw-settings" className="mb-6">
      <div className="title pb-6 pt-2">Tournament draw settings</div>
      <div className="flex items-center mb-4">
        <Input
          className="w-80"
          placeholder="Division name"
          value={tournamentDrawSettings.name}
          onChange={(event) =>
            setTournamentDrawSettings({
              type: TournamentDrawReducerActionType.SetName,
              name: event.currentTarget.value,
            })
          }
        />
        <Separator orientation="vertical" className="mx-4" />
        <label>Division:</label>
        <Select
          value={tournamentDrawSettings.category}
          // onValueChange={(value) =>
          //   setTournamentDrawSettings({
          //     type: TournamentDrawReducerActionType.SetCategory,
          //     category: value as Category,
          //   })
          // }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>{capitalizeFirstChar(tournamentDrawSettings.category)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* TODO: create a config object with all possible filter values and then create the select options dynamically */}
              <SelectItem value={Category.Open}>{capitalizeFirstChar(Category.Open)}</SelectItem>
              <SelectItem value={Category.Women}>{capitalizeFirstChar(Category.Women)}</SelectItem>
              <SelectItem value={Category.Mixed}>{capitalizeFirstChar(Category.Mixed)}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Separator orientation="vertical" className="mx-1" />
        {/* <Select
          value={tournamentDrawSettings.division}
          onValueChange={(value) =>
            setTournamentDrawSettings({ ...tournamentDrawSettings, division: value as Division })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>{capitalizeFirstChar(tournamentDrawSettings.division)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={Division.Pro}>{capitalizeFirstChar(Division.Pro)}</SelectItem>
              <SelectItem value={Division.Contender}>{capitalizeFirstChar(Division.Contender)}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select> */}
      </div>
      <div className="flex items-center">
        <label htmlFor="powerpool-teams">Powerpool teams:</label>
        <Input
          id="powerpool-teams"
          className="max-w-[68px]"
          type="number"
          min={1}
          value={tournamentDrawSettings.powerpoolTeams}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTournamentDrawSettings({
              type: TournamentDrawReducerActionType.SetPowerpoolTeamsCount,
              powerpoolTeamsCount: event.target.value,
            });
          }}
        />
        <Separator orientation="vertical" className="mx-2" />
        <label htmlFor="powerpool-groups">Powerpool groups:</label>
        <Input
          id="powerpool-groups"
          className="max-w-[68px]"
          type="number"
          min={1}
          value={tournamentDrawSettings.powerpools}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTournamentDrawSettings({
              type: TournamentDrawReducerActionType.SetPowerpoolGroupsCount,
              powerpoolGroupsCount: event.target.value,
            });
          }}
        />
        <Separator orientation="vertical" className="mx-2" />
        <label htmlFor="groups">Groups:</label>
        <Input
          id="groups"
          className="max-w-[68px]"
          type="number"
          min={1}
          value={tournamentDrawSettings.groups}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTournamentDrawSettings({
              type: TournamentDrawReducerActionType.SetGroupsCount,
              groupsCount: event.target.value,
            });
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
    </div>
  );
};
