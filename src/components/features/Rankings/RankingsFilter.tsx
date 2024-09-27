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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { RankingsFilterOptions, timePeriodOptions } from "./settings";
import { useNavigate } from "@tanstack/react-router";
import "./RankingsFilter.css";

type RankingsFilterProps = {
  rankingsFilterParams: RankingsFilterOptions;
};

export const RankingsFilter: FC<RankingsFilterProps> = ({ rankingsFilterParams }) => {
  console.log("RankingsFilter component");
  const { category, division, numberOfResultsCountedToPointsTotal, seasons } = rankingsFilterParams;

  const navigate = useNavigate();

  // TODO onValue change - hide call to navigate into an event handler here in the component
  return (
    <div
      id="rankings-filter"
      className="mb-6 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-y-6 sm:gap-x-0 lg:flex-col lg:gap-6 lg:h-min"
    >
      <div className="sm:basis-[43%] sm:pr-6 lg:basis-auto">
        <span className="font-medium">Category:</span>
        <Select
          value={category}
          onValueChange={(value) =>
            navigate({ search: { ...rankingsFilterParams, category: value as Category } })
          }
        >
          <SelectTrigger className="w-[150px]">
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
      </div>
      <div className="sm:basis-[57%] lg:basis-auto">
        <span className="font-medium">Division:</span>
        <Select
          value={division}
          onValueChange={(value) =>
            navigate({ search: { ...rankingsFilterParams, division: value as Division } })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue>{capitalizeFirstChar(division)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={Division.Pro}>{capitalizeFirstChar(Division.Pro)}</SelectItem>
              <SelectItem value={Division.Contender}>{capitalizeFirstChar(Division.Contender)}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="sm:basis-[43%] sm:pr-6 lg:basis-auto">
        <span className="font-medium">Seasons:</span>
        <div className="flex items-center gap-2">
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
          to
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
        </div>
        <Button
          variant="link"
          className="justify-start pt-0 px-3 text-blue-400 hover:text-blue-600"
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
      </div>
      <div className="sm:basis-[57%] lg:basis-auto">
        <span className="font-medium">Points total:</span>
        <div className="flex items-center gap-2">
          Sum of the best
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
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
              className="w-[50px] text-center"
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
          </div>
          results.
        </div>
      </div>
    </div>
  );
};
