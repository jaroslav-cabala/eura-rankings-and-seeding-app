import React, { FC, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { TournamentDrawPlayerDTO, TournamentDrawTeamDTO } from "@/api/apiTypes";
import { useGetRankedTeams } from "@/api/useGetRankedTeams";
import { Category, Division, RankedPlayer, RankedTeam } from "@/domain";
import { fetchRankedPlayer } from "./fetchRankedPlayers";
import { useGetRankedPlayers } from "@/api/useGetRankedPlayers";
import { CircleAlert } from "lucide-react";

type AddTeamProps = {
  addTeamHandler: (team: TournamentDrawTeamDTO) => boolean;
  category: Category;
  division: Division;
};

export const AddTeam: FC<AddTeamProps> = ({ addTeamHandler, category, division }) => {
  const [teamToAdd, setTeamToAdd] = useState<TeamToAdd>({
    id: null,
    uid: null,
    name: "",
    tournamentResults: [],
    playerOne: { id: null, uid: null, name: "", tournamentResults: [] },
    playerTwo: { id: null, uid: null, name: "", tournamentResults: [] },
  });

  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

  const [selectTeamPopoverOpen, setSelectTeamPopoverOpen] = useState<boolean>(false);
  const selectTeamInputRef = useRef(null);
  const [selectPlayerOnePopoverOpen, setSelectPlayerOnePopoverOpen] = useState<boolean>(false);
  const selectPlayerOneInputRef = useRef(null);
  const [selectPlayerTwoPopoverOpen, setSelectPlayerTwoPopoverOpen] = useState<boolean>(false);
  const selectPlayerTwoInputRef = useRef(null);

  const selectTeamInputOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const currentTeamNameValue = event.currentTarget.value;
    // update state only when the input value is not an empty string or whitespace chars
    if (!currentTeamNameValue || currentTeamNameValue.trim()) {
      // open popover only when also the length of the value is at least 2 chars
      if (currentTeamNameValue.length > 1) {
        setSelectTeamPopoverOpen(true);
      } else {
        // close popover when the length of the value is less than 2 chars
        setSelectTeamPopoverOpen(false);
      }

      setTeamToAdd({ ...teamToAdd, name: currentTeamNameValue });
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

  const onSelectTeamFromPopover = (selectedTeam: TeamToAdd | null): void => {
    // if a team is selected from the popover, update the state
    // if selectedTeam is null, it means 'create new team <value>' was clicked and state does not
    // need to be updated because team name is already in the state
    if (selectedTeam) {
      setTeamToAdd({
        ...selectedTeam,
      });
    }
    setSelectTeamPopoverOpen(false);
  };

  const selectPlayerInputOnChange = (
    playerInputId: "playerOne" | "playerTwo",
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const currentPlayerNameValue = event.currentTarget.value;

    // open popover only when also the length of the value is at least 2 chars
    if (currentPlayerNameValue.length > 1) {
      playerInputId === "playerOne"
        ? setSelectPlayerOnePopoverOpen(true)
        : setSelectPlayerTwoPopoverOpen(true);
    } else {
      // close popover when the length of the value is less than 2 chars
      playerInputId === "playerOne"
        ? setSelectPlayerOnePopoverOpen(false)
        : setSelectPlayerTwoPopoverOpen(false);
    }
    // update state only when the input value is not an empty string or whitespace chars
    if (!currentPlayerNameValue || currentPlayerNameValue.trim()) {
      if (playerInputId === "playerOne") {
        setTeamToAdd({
          ...teamToAdd,
          playerOne: { ...teamToAdd.playerOne, name: currentPlayerNameValue },
        });
      } else {
        setTeamToAdd({
          ...teamToAdd,
          playerTwo: { ...teamToAdd.playerTwo, name: currentPlayerNameValue },
        });
      }
    }
  };

  // we can probably use event.currentTarget.id or smth to identify the input element
  const selectPlayerInputOnFocus = (
    playerInputId: "playerOne" | "playerTwo",
    event: React.FocusEvent<HTMLInputElement>
  ): void => {
    // open popover only when the input value is not an empty string or whitespace chars
    // and length of the value is at least 2 characters
    if (event.currentTarget.value.trim().length > 1) {
      playerInputId === "playerOne"
        ? setSelectPlayerOnePopoverOpen(true)
        : setSelectPlayerTwoPopoverOpen(true);
    }
  };

  const hideSelectPlayerPopover = (playerInputId: "playerOne" | "playerTwo", event: Event) => {
    const selectPlayerInputRef =
      playerInputId === "playerOne" ? selectPlayerOneInputRef : selectPlayerTwoInputRef;
    // we want to hide the popover when an interaction happens anywhere but the select team input
    if (event.currentTarget !== selectPlayerInputRef.current) {
      playerInputId === "playerOne"
        ? setSelectPlayerOnePopoverOpen(false)
        : setSelectPlayerTwoPopoverOpen(false);
    }
  };

  const onSelectPlayerFromPopover = (
    playerInputId: "playerOne" | "playerTwo",
    selectedPlayer: TournamentDrawPlayerDTO | null
  ): void => {
    // if a player is selected from the popover, update the state
    // if selectedPlayer is null, it means 'add new player <value>' was clicked and state does not
    // need to be updated because player name is already in the state
    if (selectedPlayer) {
      if (playerInputId === "playerOne") {
        setTeamToAdd({
          ...teamToAdd,
          playerOne: selectedPlayer,
        });
      } else {
        setTeamToAdd({
          ...teamToAdd,
          playerTwo: selectedPlayer,
        });
      }
    }

    playerInputId === "playerOne"
      ? setSelectPlayerOnePopoverOpen(false)
      : setSelectPlayerTwoPopoverOpen(false);
  };

  const onAddTeamFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFormSubmitAttempted(true);

    if (teamToAdd.name && teamToAdd.playerOne.name && teamToAdd.playerTwo.name) {
      const isSuccessful = addTeamHandler({
        id: teamToAdd.id,
        uid: teamToAdd.uid,
        name: teamToAdd.name,
        tournamentResults: teamToAdd.tournamentResults,
        players: [teamToAdd.playerOne, teamToAdd.playerTwo],
      });

      if (isSuccessful) {
        setTeamToAdd({
          id: null,
          uid: null,
          name: "",
          tournamentResults: [],
          playerOne: { id: null, uid: null, name: "", tournamentResults: [] },
          playerTwo: { id: null, uid: null, name: "", tournamentResults: [] },
        });
      }

      setFormSubmitAttempted(false);
    }
  };

  const addTeamFormValidationMessage = !teamToAdd.name
    ? !teamToAdd.playerOne?.name || !teamToAdd.playerTwo?.name
      ? "Fill in team name and player names"
      : "A team name is required"
    : !teamToAdd.playerOne?.name || !teamToAdd.playerTwo?.name
      ? "Player names are required"
      : undefined;

  return (
    <div id="add-team" className="mb-6 mt-6">
      <form onSubmit={(e) => onAddTeamFormSubmit(e)}>
        <Popover open={selectTeamPopoverOpen}>
          <PopoverAnchor asChild>
            <Input
              value={teamToAdd.name}
              onChange={selectTeamInputOnChange}
              onFocus={selectTeamInputOnFocus}
              placeholder="Find a team or add a new one..."
              ref={selectTeamInputRef}
              aria-required
              aria-invalid={formSubmitAttempted && !teamToAdd.name}
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
            <PopoverContentRankedTeams
              category={category}
              division={division}
              teamNameInputValue={teamToAdd.name}
              selectTeamFromPopoverHandler={onSelectTeamFromPopover}
            />
          </PopoverContent>
        </Popover>
        <Popover open={selectPlayerOnePopoverOpen}>
          <PopoverAnchor asChild>
            <Input
              value={teamToAdd.playerOne.name}
              onChange={(e) => selectPlayerInputOnChange("playerOne", e)}
              onFocus={(e) => selectPlayerInputOnFocus("playerOne", e)}
              placeholder="Find a player or add a new one..."
              ref={selectPlayerOneInputRef}
              aria-required
              aria-invalid={formSubmitAttempted && !teamToAdd.playerOne.name}
            />
          </PopoverAnchor>
          <PopoverContent
            className="p-2 select-team-popover-content"
            onEscapeKeyDown={(e) => hideSelectPlayerPopover("playerOne", e)}
            onPointerDownOutside={(e) => hideSelectPlayerPopover("playerOne", e)}
            onFocusOutside={(e) => hideSelectPlayerPopover("playerOne", e)}
            onInteractOutside={(e) => hideSelectPlayerPopover("playerOne", e)}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <PopoverContentRankedPlayers
              playerInputId="playerOne"
              category={category}
              division={division}
              playerNameInputValue={teamToAdd.playerOne.name}
              selectPlayerFromPopoverHandler={onSelectPlayerFromPopover}
            />
          </PopoverContent>
        </Popover>
        <Popover open={selectPlayerTwoPopoverOpen}>
          <PopoverAnchor asChild>
            <Input
              value={teamToAdd.playerTwo.name}
              onChange={(e) => selectPlayerInputOnChange("playerTwo", e)}
              onFocus={(e) => selectPlayerInputOnFocus("playerTwo", e)}
              placeholder="Find a player or add a new one..."
              ref={selectPlayerTwoInputRef}
              aria-required
              aria-invalid={formSubmitAttempted && !teamToAdd.playerTwo.name}
            />
          </PopoverAnchor>
          <PopoverContent
            className="p-2 select-team-popover-content"
            onEscapeKeyDown={(e) => hideSelectPlayerPopover("playerTwo", e)}
            onPointerDownOutside={(e) => hideSelectPlayerPopover("playerTwo", e)}
            onFocusOutside={(e) => hideSelectPlayerPopover("playerTwo", e)}
            onInteractOutside={(e) => hideSelectPlayerPopover("playerTwo", e)}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <PopoverContentRankedPlayers
              playerInputId="playerTwo"
              category={category}
              division={division}
              playerNameInputValue={teamToAdd.playerTwo.name}
              selectPlayerFromPopoverHandler={onSelectPlayerFromPopover}
            />
          </PopoverContent>
        </Popover>
        <div className="flex items-center justify-between">
          <Button variant="default" type="submit">
            Add team
          </Button>
          {formSubmitAttempted && addTeamFormValidationMessage && (
            <p role="alert" className="flex items-center justify-center text-red-500">
              <CircleAlert className="w-6 mr-2" />
              {addTeamFormValidationMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

type PopoverContentRankedTeamsProps = {
  teamNameInputValue: string;
  category: Category;
  division: Division;
  selectTeamFromPopoverHandler: (selectedTeam: TeamToAdd | null) => void;
};

const PopoverContentRankedTeams: React.FC<PopoverContentRankedTeamsProps> = ({
  teamNameInputValue,
  category,
  division,
  selectTeamFromPopoverHandler,
}) => {
  const {
    data: rankedTeams,
    loading,
    error,
  } = useGetRankedTeams({
    category,
    division,
    numberOfResultsCountedToPointsTotal: 3,
  });

  const onTeamSelected = async (team: RankedTeam) => {
    const teamPlayers = await Promise.all(
      team.players.map((player) => fetchRankedPlayer(player.id, category))
    );

    const playersWithResults: Array<TournamentDrawPlayerDTO> = team.players.map((player) => ({
      ...player,
      tournamentResults: teamPlayers.find((tp) => tp?.id === player.id)?.tournamentResults ?? [],
    }));

    const selectedTeam: TeamToAdd = {
      ...team,
      playerOne: playersWithResults[0],
      playerTwo: playersWithResults[1],
    };

    selectTeamFromPopoverHandler(selectedTeam);
  };

  const onCreateNewTeam = () => {
    selectTeamFromPopoverHandler(null);
  };

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
            onClick={onCreateNewTeam}
          >
            Create new team&nbsp;<span className="font-bold">"{teamNameInputValue}"</span>
          </li>
          <hr />
          {rankedTeams
            .filter((team) => team.name.includes(teamNameInputValue))
            .map((team) => (
              <li
                key={team.id}
                onClick={() => onTeamSelected(team)}
                className="h-[60px] p-2 flex items-center hover:cursor-pointer hover:bg-[#f1f5f9]"
              >
                <div>
                  <div className="font-medium">{`${team.name}`}</div>
                  <div className="lowlighted-text">
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

type PopoverContentRankedPlayersProps = {
  playerInputId: "playerOne" | "playerTwo";
  playerNameInputValue: string;
  category: Category;
  division: Division;
  selectPlayerFromPopoverHandler: (
    playerInputId: "playerOne" | "playerTwo",
    selectedPlayer: TournamentDrawPlayerDTO | null
  ) => void;
};

const PopoverContentRankedPlayers: React.FC<PopoverContentRankedPlayersProps> = ({
  playerInputId,
  playerNameInputValue,
  category,
  division,
  selectPlayerFromPopoverHandler,
}) => {
  const {
    data: rankedPlayers,
    loading,
    error,
  } = useGetRankedPlayers({
    category,
    division,
    numberOfResultsCountedToPointsTotal: 3,
  });

  // TODO RankedPlayer type contains 'points' prop, but we ignore it(TournamentDrawPlayerDTO type does not have it)
  const onPlayerSelected = async (selectedPlayer: RankedPlayer) => {
    selectPlayerFromPopoverHandler(playerInputId, selectedPlayer);
  };

  const onAddNewPlayer = () => {
    selectPlayerFromPopoverHandler(playerInputId, null);
  };

  if (error) {
    return "error while searching for players...";
  }

  return (
    <>
      {loading ? (
        "loading...."
      ) : (
        <ol>
          <li
            key="addNewPlayer"
            className="h-[40px] p-2 flex items-center justify-center hover:cursor-pointer hover:bg-[#f1f5f9]"
            onClick={onAddNewPlayer}
          >
            Add new player&nbsp;<span className="font-bold">"{playerNameInputValue}"</span>
          </li>
          <hr />
          {rankedPlayers
            .filter((player) => player.name.includes(playerNameInputValue))
            .map((player) => (
              <li
                key={player.id}
                onClick={() => onPlayerSelected(player)}
                className="h-[40px] p-2 flex items-center hover:cursor-pointer hover:bg-[#f1f5f9]"
              >
                <div>
                  <div className="font-medium">{`${player.name}`}</div>
                </div>
              </li>
            ))}
        </ol>
      )}
    </>
  );
};

type TeamToAdd = Pick<TournamentDrawTeamDTO, "id" | "name" | "tournamentResults" | "uid"> & {
  playerOne: TournamentDrawPlayerDTO;
  playerTwo: TournamentDrawPlayerDTO;
};
