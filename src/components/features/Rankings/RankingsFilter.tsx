import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Division } from "@/domain";
import { TimePeriod, capitalizeFirstChar, getCurrentYear } from "@/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { RankingsFilterOptions, timePeriodOptions } from "./settings";
import { useNavigate } from "@tanstack/react-router";

type RankingsFilterProps = {
  rankingsFilterParams: RankingsFilterOptions;
};

export const RankingsFilter: FC<RankingsFilterProps> = ({ rankingsFilterParams }) => {
  console.log("RankingsFilter component");
  const { category, division, numberOfResultsCountedToPointsTotal, seasons } = rankingsFilterParams;

  const navigate = useNavigate();

  // TODO onValue change - hide call to navigate into an event handler here in the component
  return (
    // <div className="w-1/2 flex mx-auto items-center py-1" style={{ justifyContent: "left" }}>
    <div className="w-1/2 mx-auto">
      Category:
      <Separator orientation="vertical" className="mx-1" />
      <Select
        value={category}
        onValueChange={(value) =>
          navigate({ search: { ...rankingsFilterParams, category: value as Category } })
        }
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue>{capitalizeFirstChar(category)}</SelectValue>
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
      <Separator orientation="vertical" className="mx-2" />
      Division:
      <Separator orientation="vertical" className="mx-1" />
      <Select
        value={division}
        onValueChange={(value) =>
          navigate({ search: { ...rankingsFilterParams, division: value as Division } })
        }
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue>{capitalizeFirstChar(division)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={Division.Pro}>{capitalizeFirstChar(Division.Pro)}</SelectItem>
            <SelectItem value={Division.Contender}>{capitalizeFirstChar(Division.Contender)}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="mx-2" />
      Seasons:
      <Separator orientation="vertical" className="mx-1" />
      <Select
        value={seasons.from}
        onValueChange={(value) =>
          navigate({ search: { ...rankingsFilterParams, seasons: { ...seasons, from: value } } })
        }
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue>{seasons.from}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {timePeriodOptions.map((option) => (
              <SelectItem key={option.toString()} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="mx-1" />
      to
      <Separator orientation="vertical" className="mx-1" />
      <Select
        value={seasons.to}
        onValueChange={(value) =>
          navigate({ search: { ...rankingsFilterParams, seasons: { ...seasons, to: value } } })
        }
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue>{seasons.to}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {timePeriodOptions.map((option) => (
              <SelectItem key={option.toString()} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="mx-1" />
      <Button
        variant="link"
        className="px-1"
        onClick={() =>
          navigate({
            search: {
              ...rankingsFilterParams,
              seasons: { from: getCurrentYear.toString(), to: getCurrentYear.toString() } as TimePeriod,
            },
          })
        }
      >
        {getCurrentYear}
      </Button>
      <Separator orientation="vertical" className="mx-1" />
      <div className="flex items-center">
        Total of points: sum of the best
        <Button
          variant="outline"
          size="icon"
          className="ml-1"
          onClick={() =>
            navigate({
              search: {
                ...rankingsFilterParams,
                numberOfResultsCountedToPointsTotal: numberOfResultsCountedToPointsTotal - 1,
              },
            })
          }
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Input
          className="w-[50px] mx-1"
          value={numberOfResultsCountedToPointsTotal}
          onChange={(event) =>
            navigate({
              search: {
                ...rankingsFilterParams,
                numberOfResultsCountedToPointsTotal: event.currentTarget.value,
              },
            })
          }
        ></Input>
        <Button
          variant="outline"
          size="icon"
          className="mr-1"
          onClick={() =>
            navigate({
              search: {
                ...rankingsFilterParams,
                numberOfResultsCountedToPointsTotal: numberOfResultsCountedToPointsTotal + 1,
              },
            })
          }
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        results
      </div>
    </div>
  );
};
