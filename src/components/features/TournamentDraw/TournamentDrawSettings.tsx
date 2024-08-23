import { FC, useState } from "react";
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
import { capitalizeFirstChar } from "@/utils";
import { Category, Division } from "@/domain";

type TournamentDivisionDetailsProps = {
  setTournamentDrawSettingsHandler: () => void;
};
export const TournamentDivisionDetails: FC<TournamentDivisionDetailsProps> = ({
  setTournamentDrawSettingsHandler,
}) => {
  // const [team, setTeam] = useState<Team>();
  const [tournamentDivisionDetails, setTournamentDivisionDetails] = useState<{
    category: Category;
    division: Division;
    name: string;
  }>({ category: Category.Open, division: Division.Pro, name: "" });

  return (
    <div id="tournament-draw-settings" className="mb-4">
      <p className="title pt-0 pb-4">Division settings</p>
      <div id="tournament-draw-settings-form">
        <Input
          className="w-80"
          placeholder="Division name"
          value={tournamentDivisionDetails.name}
          onChange={(event) =>
            setTournamentDivisionDetails({ ...tournamentDivisionDetails, name: event.currentTarget.value })
          }
        />
        <Separator orientation="vertical" className="mx-4" />
        <label>Division:</label>
        <Select
          value={tournamentDivisionDetails.category}
          onValueChange={(value) =>
            setTournamentDivisionDetails({ ...tournamentDivisionDetails, category: value as Category })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>{capitalizeFirstChar(tournamentDivisionDetails.category)}</SelectValue>
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
        <Select
          value={tournamentDivisionDetails.division}
          onValueChange={(value) =>
            setTournamentDivisionDetails({ ...tournamentDivisionDetails, division: value as Division })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>{capitalizeFirstChar(tournamentDivisionDetails.division)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={Division.Pro}>{capitalizeFirstChar(Division.Pro)}</SelectItem>
              <SelectItem value={Division.Contender}>{capitalizeFirstChar(Division.Contender)}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
