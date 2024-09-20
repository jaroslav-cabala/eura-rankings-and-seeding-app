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
import { Category, Division } from "@/domain";
import { capitalizeFirstChar } from "@/utils";
import { TournamentDrawDTO } from "@/api/apiTypes";
import { TournamentDrawReducerActionType, TournamentDrawReducerActionTypes } from "./tournamentDrawReducer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type TournamentDrawSettingsProps = {
  setTournamentDrawSettings: Dispatch<TournamentDrawReducerActionTypes>;
  tournamentDrawSettings: Pick<
    TournamentDrawDTO,
    "name" | "powerpoolTeams" | "powerpools" | "groups" | "teamPointsCountMethod" | "category" | "divisions"
  > & { teamCount: number };
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
      <div className="flex items-center mb-6">
        <label htmlFor="tournamentDrawName">Name:</label>
        <Input
          id="tournamentDrawName"
          className="w-80"
          value={tournamentDrawSettings.name}
          onChange={(event) =>
            setTournamentDrawSettings({
              type: TournamentDrawReducerActionType.SetName,
              name: event.currentTarget.value,
            })
          }
        />
      </div>
      <div className="flex items-center mb-6">
        <label htmlFor="selectCategory">Category:</label>
        <Select
          value={tournamentDrawSettings.category}
          onValueChange={(value) =>
            setTournamentDrawSettings({
              type: TournamentDrawReducerActionType.SetCategory,
              category: value as Category,
            })
          }
        >
          <SelectTrigger id="selectCategory" className="w-[130px]">
            <SelectValue>{capitalizeFirstChar(tournamentDrawSettings.category)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(Category).map(([, category]) => (
                <SelectItem key={category} value={category}>
                  {capitalizeFirstChar(category)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Separator orientation="vertical" className="mx-3" />
        <label htmlFor="selectCategory">Divisions:</label>
        <ToggleGroup
          value={[...tournamentDrawSettings.divisions]}
          onValueChange={(value) =>
            setTournamentDrawSettings({
              type: TournamentDrawReducerActionType.SetDivisions,
              divisions: value as Array<Division>,
            })
          }
          type="multiple"
          variant="outline"
        >
          {Object.entries(Division).map(([, division]) => (
            <ToggleGroupItem key={division} value={division}>
              {division}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="flex items-center mb-6">
        <label htmlFor="powerpool-teams">Powerpool teams:</label>
        <Input
          id="powerpool-teams"
          className="max-w-[68px]"
          type="number"
          min={0}
          value={tournamentDrawSettings.powerpoolTeams}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setTournamentDrawSettings({
              type: TournamentDrawReducerActionType.SetPowerpoolTeamsCount,
              powerpoolTeamsCount: event.target.value,
            })
          }
        />
        <Separator orientation="vertical" className="mx-3" />
        <label htmlFor="powerpool-groups">Powerpool groups:</label>
        <Input
          id="powerpool-groups"
          className="max-w-[68px]"
          type="number"
          min={0}
          value={tournamentDrawSettings.powerpools}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setTournamentDrawSettings({
              type: TournamentDrawReducerActionType.SetPowerpoolGroupsCount,
              powerpoolGroupsCount: event.target.value,
            })
          }
        />
        <Separator orientation="vertical" className="mx-3" />
        <label htmlFor="groups">Groups:</label>
        <Input
          id="groups"
          className="max-w-[68px]"
          type="number"
          min={1}
          max={tournamentDrawSettings.teamCount}
          value={tournamentDrawSettings.groups}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setTournamentDrawSettings({
              type: TournamentDrawReducerActionType.SetGroupsCount,
              groupsCount: event.target.value,
            })
          }
        />
      </div>
      <div>
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
