import React, { FC, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { TournamentDrawTeamDTO } from "@/api/apiTypes";
import { useGetRankedTeams } from "@/api/useGetRankedTeams";
import { Category, Division, RankedTeam } from "@/domain";

type AddTeamProps = {
  addTeamHandler: () => void;
  category: Category;
};
export const AddTeam: FC<AddTeamProps> = ({ addTeamHandler, category }) => {
  const [team, setTeam] = useState<TournamentDrawTeamDTO>({
    id: null,
    uid: null,
    name: "",
    players: [],
    tournamentResults: [],
  });

  const [selectTeamPopoverOpen, setSelectTeamPopoverOpen] = useState<boolean>(false);
  const selectTeamInputRef = useRef(null);

  const selectTeamInputOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const currentTeamNameValue = event.currentTarget.value;
    // update state only when the input value is not an empty string or whitespace chars
    if (!currentTeamNameValue || currentTeamNameValue.trim()) {
      setTeam({ ...team, name: currentTeamNameValue });

      // open popover only when also the length of the value is at least 2 chars
      if (currentTeamNameValue.length > 1) {
        setSelectTeamPopoverOpen(true);
      } else {
        setSelectTeamPopoverOpen(false); // close popover when the length of the value is less than 2 chars
      }
    }
  };

  const selectTeamInputOnFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    // open popover only when the input value is not an empty string or whitespace chars
    // and length of the value is at least 2 characters
    if (event.currentTarget.value.trim().length > 1) {
      setSelectTeamPopoverOpen(true);
    }
  };

  const hideSelectTeamPopover = (event: Event) => {
    // we want to hide the popover when an interaction happens anywhere but the select team input
    if (event.currentTarget !== selectTeamInputRef.current) {
      setSelectTeamPopoverOpen(false);
    }
  };

  const onSelectTeamFromPopover = (selectedTeam: RankedTeam): void => {
    setTeam({
      id: selectedTeam.id,
      uid: selectedTeam.uid,
      name: selectedTeam.name,
      players: selectedTeam.players.map((player) => ({ ...player, tournamentResults: [] })),
      tournamentResults: selectedTeam.tournamentResults,
    });
  };

  return (
    <div id="add-team" className="mb-2">
      <Popover open={selectTeamPopoverOpen}>
        <PopoverAnchor asChild>
          <Input
            value={team.name}
            onChange={selectTeamInputOnChange}
            onFocus={selectTeamInputOnFocus}
            placeholder="Find a team or add a new one..."
            ref={selectTeamInputRef}
          />
        </PopoverAnchor>
        <PopoverContent
          className="p-2 select-team-popover-content"
          onEscapeKeyDown={(e) => hideSelectTeamPopover(e)}
          onPointerDownOutside={(e) => hideSelectTeamPopover(e)}
          onFocusOutside={(e) => hideSelectTeamPopover(e)}
          onInteractOutside={(e) => hideSelectTeamPopover(e)}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <PopoverContentRankedTeam
            category={category}
            teamNameInputValue={team.name}
            selectTeamFromPopoverHandler={onSelectTeamFromPopover}
          />
        </PopoverContent>
      </Popover>
      <Input
        value={team.players[0]?.name}
        // onChange={(event) =>
        //   setTeam({ ...team, players: { ...team.playerOne, name: event.currentTarget.value } } as Team)
        // }
        placeholder="Player name"
      />
      <Input
        value={team.players[1]?.name}
        // onChange={(event) =>
        //   setTeam({ ...team, playerTwo: { ...team?.playerTwo, name: event.currentTarget.value } } as Team)
        // }
        placeholder="Player name"
      />
      <Button variant="default" onClick={addTeamHandler}>
        Add team
      </Button>
    </div>
  );
};

type PopoverContentRankedTeamProps = {
  teamNameInputValue: string;
  category: Category;
  selectTeamFromPopoverHandler: (selectedTeam: RankedTeam) => void;
};

const PopoverContentRankedTeam: React.FC<PopoverContentRankedTeamProps> = ({
  teamNameInputValue,
  category,
  selectTeamFromPopoverHandler,
}) => {
  const {
    data: rankedTeams,
    loading,
    error,
  } = useGetRankedTeams({
    category,
    division: Division.Pro,
    numberOfResultsCountedToPointsTotal: 3,
    fromSeason: "2023",
    toSeason: "2024",
  });

  if (error) {
    return "error while searching for teams...";
  }

  return (
    <>
      {loading ? (
        "loading...."
      ) : (
        <ol>
          <li
            key="createNewTeam"
            className="h-[60px] p-2 flex items-center justify-center hover:cursor-pointer hover:bg-[#f1f5f9]"
          >
            Create new team&nbsp;<span className="font-bold">"{teamNameInputValue}"</span>
          </li>
          <hr />
          {rankedTeams
            .filter((team) => team.name.includes(teamNameInputValue))
            .map((team) => (
              <li
                key={team.id}
                onClick={() => selectTeamFromPopoverHandler(team)}
                className="h-[60px] p-2 flex items-center hover:cursor-pointer hover:bg-[#f1f5f9]"
              >
                <div>
                  <div className="team-name">{`${team.name}`}</div>
                  <div className="team-players">
                    {team.players[0]?.name}, {team.players[1]?.name}
                  </div>
                </div>
              </li>
            ))}
        </ol>
      )}
    </>
  );
};
