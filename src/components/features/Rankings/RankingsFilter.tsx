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
import { UseRankingsFilterState } from "./useRankingsFilterState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { timePeriodOptions } from "./settings";

type RankingsFilterProps = {
  rankingsFilterState: Pick<
    UseRankingsFilterState,
    | "category"
    | "division"
    | "seasons"
    | "numberOfResultsCountedToPointsTotal"
    | "setCategory"
    | "setDivision"
    | "setSeasons"
    | "setNumberOfResultsCountedToPointsTotal"
  >;
};

export const RankingsFilter: FC<RankingsFilterProps> = ({
  rankingsFilterState: {
    category,
    setCategory,
    division,
    setDivision,
    seasons,
    setSeasons,
    numberOfResultsCountedToPointsTotal,
    setNumberOfResultsCountedToPointsTotal,
  },
}) => {
  console.log("RankingsFilter component");

  return (
    // <div className="w-1/2 flex mx-auto items-center py-1" style={{ justifyContent: "left" }}>
    <div className="w-1/2 mx-auto">
      Category:
      <Separator orientation="vertical" className="mx-1" />
      <Select
        value={category}
        onValueChange={(value) => {
          setCategory(value as Category);
        }}
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
      <Select value={division} onValueChange={(value) => setDivision(value as Division)}>
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
      <Select value={seasons.from} onValueChange={(value) => setSeasons({ ...seasons, from: value })}>
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
      <Select value={seasons.to} onValueChange={(value) => setSeasons({ ...seasons, to: value })}>
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
          setSeasons({ from: getCurrentYear.toString(), to: getCurrentYear.toString() } as TimePeriod)
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
          onClick={() => setNumberOfResultsCountedToPointsTotal(numberOfResultsCountedToPointsTotal - 1)}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Input
          className="w-[50px] mx-1"
          value={numberOfResultsCountedToPointsTotal}
          onChange={(event) =>
            setNumberOfResultsCountedToPointsTotal(event.target.value as unknown as number)
          }
        ></Input>
        <Button
          variant="outline"
          size="icon"
          className="mr-1"
          onClick={() => setNumberOfResultsCountedToPointsTotal(numberOfResultsCountedToPointsTotal + 1)}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        results
      </div>
    </div>
  );
};
