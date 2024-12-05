import { Dispatch } from "react";
import { Input } from "@/components/ui/input";
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
import { TeamPointsCountMethod, teamPointsCountMethods, GroupStageDrawDTO } from "@/api/apiTypes";
import { groupStageDrawReducerActionType, GroupStageDrawReducerActionTypes } from "./groupStageDrawReducer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type SettingsProps = {
  setGroupStageDrawSettings: Dispatch<GroupStageDrawReducerActionTypes>;
  groupStageDrawSettings: Pick<
    GroupStageDrawDTO,
    | "name"
    | "powerpoolTeams"
    | "powerpools"
    | "groups"
    | "teamPointsCountMethod"
    | "numberOfBestResultsCountedToPointsTotal"
    | "category"
    | "divisions"
  > & { teamCount: number };
};
export const Settings: React.FC<SettingsProps> = ({ groupStageDrawSettings, setGroupStageDrawSettings }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-left title">
        <h1>Settings</h1>
      </div>
      <div className="">
        <label className="font-medium" htmlFor="tournamentDrawName">
          Name:
        </label>
        <Input
          id="tournamentDrawName"
          className="mt-2 shadow-sm lg:max-w-[500px]"
          value={groupStageDrawSettings.name}
          onChange={(event) =>
            setGroupStageDrawSettings({
              type: groupStageDrawReducerActionType.SetName,
              name: event.currentTarget.value,
            })
          }
        />
      </div>
      <div className="flex gap-x-6">
        <div>
          <label className="font-medium" htmlFor="selectCategory">
            Category:
          </label>
          <Select
            value={groupStageDrawSettings.category.toString()}
            onValueChange={(value) =>
              setGroupStageDrawSettings({
                type: groupStageDrawReducerActionType.SetCategory,
                category: Number(value),
              })
            }
          >
            <SelectTrigger id="selectCategory" className="min-w-40 max-w-[150px] mt-2 shadow-sm">
              <SelectValue>{capitalizeFirstChar(groupStageDrawSettings.category.toString())}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* {Object.entries(Category).map(([, category]) => (
                  <SelectItem key={category} value={category}>
                    {capitalizeFirstChar(category)}
                  </SelectItem>
                ))} */}
                {[1, 2, 3].map((val) => (
                  <SelectItem key={val} value={val.toString()}>
                    {val}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="font-medium">Divisions:</label>
          <ToggleGroup
            value={[...groupStageDrawSettings.divisions.map((division) => division.toString())]}
            onValueChange={(values) =>
              setGroupStageDrawSettings({
                type: groupStageDrawReducerActionType.SetDivisions,
                divisions: values.map((val) => Number(val)),
              })
            }
            type="multiple"
            variant="outline"
            className="justify-start mt-2"
          >
            {/* {Object.entries(Division).map(([, division]) => (
              <ToggleGroupItem key={division} value={division} className="shadow-sm">
                {division}
              </ToggleGroupItem>
            ))} */}
            {[1, 2].map((val) => (
              <ToggleGroupItem key={val} value={val.toString()} className="shadow-sm">
                {val}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <div>
        <label className="font-medium">Seeding points calculation: </label>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 items-center">
          <RadioGroup
            value={groupStageDrawSettings.teamPointsCountMethod}
            onValueChange={(value) =>
              setGroupStageDrawSettings({
                type: groupStageDrawReducerActionType.SetTeamPointsCountMethod,
                teamPointsCountMethod: value as TeamPointsCountMethod,
              })
            }
          >
            {teamPointsCountMethods.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <RadioGroupItem value={method} id={method} />
                <label htmlFor={method}>{method}</label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex items-center gap-2">
            <NumberInputWithButtonsToChangeValue
              inputId="best-results-count"
              value={groupStageDrawSettings.numberOfBestResultsCountedToPointsTotal}
              valueSetter={(value: number) =>
                setGroupStageDrawSettings({
                  type: groupStageDrawReducerActionType.SetNumberOfBestResultsCountedToPointsTotal,
                  numberOfBestResultsCountedToPointsTotal: value,
                })
              }
            />
            <label htmlFor="best-results-count">best results</label>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <div>
          <label className="font-medium" htmlFor="powerpool-teams">
            Powerpool teams:
          </label>
          <div className="mt-2">
            <NumberInputWithButtonsToChangeValue
              inputId="powerpool-teams"
              value={groupStageDrawSettings.powerpoolTeams}
              maxValue={groupStageDrawSettings.teamCount}
              valueSetter={(value: number) =>
                setGroupStageDrawSettings({
                  type: groupStageDrawReducerActionType.SetPowerpoolTeamsCount,
                  powerpoolTeamsCount: value.toString(),
                })
              }
            />
          </div>
        </div>
        <div>
          <label className="font-medium" htmlFor="powerpool-groups">
            Powerpool groups:
          </label>
          <div className="mt-2">
            <NumberInputWithButtonsToChangeValue
              inputId="powerpool-groups"
              value={groupStageDrawSettings.powerpools}
              maxValue={groupStageDrawSettings.powerpoolTeams}
              valueSetter={(value: number) =>
                setGroupStageDrawSettings({
                  type: groupStageDrawReducerActionType.SetPowerpoolGroupsCount,
                  powerpoolGroupsCount: value.toString(),
                })
              }
            />
          </div>
        </div>
        <div>
          <label className="font-medium" htmlFor="groups">
            Groups:
          </label>
          <div className="mt-2">
            <NumberInputWithButtonsToChangeValue
              inputId="groups"
              value={groupStageDrawSettings.groups}
              maxValue={groupStageDrawSettings.teamCount}
              valueSetter={(value: number) =>
                setGroupStageDrawSettings({
                  type: groupStageDrawReducerActionType.SetGroupsCount,
                  groupsCount: value.toString(),
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NumberInputWithButtonsToChangeValue = ({
  inputId,
  maxValue,
  value,
  valueSetter,
}: {
  inputId: string;
  value: number;
  maxValue?: number;
  valueSetter: (val: number) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => valueSetter(value === 0 ? value : value - 1)}
          disabled={value === 0}
          className="shadow-sm"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Input
          id={inputId}
          className="w-16 shadow-sm"
          type="number"
          min={0}
          max={maxValue}
          step={1}
          value={value}
          onChange={(event) => {
            // TODO test
            const parsedNumber = parseInt(event.target.value, 10);
            !isNaN(parsedNumber) && valueSetter(Math.abs(parseInt(event.target.value, 10)));
          }}
        ></Input>
        <Button
          variant="outline"
          size="icon"
          className="shadow-sm"
          onClick={() => valueSetter(maxValue === undefined || value < maxValue ? value + 1 : value)}
          disabled={value === maxValue}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
