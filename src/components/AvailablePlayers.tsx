import { useState } from "react";
import { ParticipatingTeam } from "./types";
import { RankedPlayers, useGetRankedPlayers } from "../hooks/useGetRankedPlayers";
import { Player } from "../apiTypes";
import { Division } from "../domain";
import "./AvailablePlayers.css";

export const AvailablePlayers = (props: {
  participatingTeams: Array<ParticipatingTeam>;
  onTwoPlayersSelected: (teamName: string, playerOne: Player, playerTwo: Player, points: number) => void;
}) => {
  const { data: players, loading, error } = useGetRankedPlayers(Division.Open);
  const [selectedPlayers, setSelectedPlayers] = useState<RankedPlayers>([]);
  const [isNewTeamFormOpen, setIsNewTeamFormOpen] = useState<boolean>(false);

  const selectedPlayers_ids = selectedPlayers.map((selectedPlayer) => selectedPlayer.playerId);

  // when 2. player is selected, both are removed from the list of avialable players and
  // moved to tournament teams list as a new team
  const onSelectPlayerHandler = (playerId: string, playerUid: string, playerName: string, points: number) => {
    if (selectedPlayers.length === 1) {
      const firstSelectedPlayer = selectedPlayers[0];
      const newTeam: ParticipatingTeam = {
        name: `${firstSelectedPlayer.name}/${playerName}`,
        playerOne: {
          name: firstSelectedPlayer.name,
          id: firstSelectedPlayer.playerId,
          uid: firstSelectedPlayer.playerUid,
        },
        playerTwo: { name: playerName, id: playerId, uid: playerUid },
        points: firstSelectedPlayer.points + points,
      };
      setSelectedPlayers([]);
      props.onTwoPlayersSelected(newTeam.name, newTeam.playerOne, newTeam.playerTwo, newTeam.points);
    } else {
      setSelectedPlayers((selectedPlayers) => [
        ...selectedPlayers,
        { name: playerName, playerId, playerUid, points },
      ]);
    }
  };

  const addNewTeamFormSubmitHandler = (formData: FormData): void => {
    const player1Name = formData.get("player1Name") as string;
    const player1Points = formData.get("player1Points") as string;
    const player2Name = formData.get("player2Name") as string;
    const player2Points = formData.get("player2Points") as string;

    if (player1Name && player1Points && player2Name && player2Points) {
      const teamName = `${player1Name} / ${player2Name}`;
      props.onTwoPlayersSelected(
        teamName,
        { name: player1Name, id: "", uid: "" },
        { name: player2Name, id: "", uid: "" },
        Number(player1Points) + Number(player2Points)
      );
    }
  };

  if (loading) {
    return <div className="">LOADING RANKED PLAYERS</div>;
  }

  if (error) {
    return <div className="">ERROR WHILE LOADING RANKED PLAYERS</div>;
  }

  const onlyPlayersNotInTheTournament: RankedPlayers = players.filter((player) => {
    const isPlayerInTheTournament = props.participatingTeams.find(
      (team) => team.playerOne.uid === player.playerUid || team.playerTwo.uid === player.playerUid
    );

    return isPlayerInTheTournament ? false : true;
  });

  return (
    <>
      {/* <FormControlLabel
        value={isNewTeamFormOpen}
        control={<Checkbox />}
        label="Add new team"
        labelPlacement="end"
        onChange={(_, checked) => {
          setIsNewTeamFormOpen(checked);
        }}
      /> */}
      {/* {isNewTeamFormOpen && (
        <form action={addNewTeamFormSubmitHandler}>
          <Grid container xs={12}>
            <Grid xs={12}>New Team</Grid>
            <Grid xs={8}>
              <TextField required name="player1Name" label="Player 1 name" variant="outlined" />
            </Grid>
            <Grid xs={4}>
              <TextField required name="player1Points" label="Points" variant="outlined" />
            </Grid>
            <Grid xs={8}>
              <TextField required name="player2Name" label="Player 2 name" variant="outlined" />
            </Grid>
            <Grid xs={4}>
              <TextField required name="player2Points" label="Points" variant="outlined" />
            </Grid>
            <Button type="submit" variant="outlined">
              Add team to the tournament
            </Button>
          </Grid>
        </form>
      )} */}
      <div>
        <p className="title">Available players {onlyPlayersNotInTheTournament.length}</p>
        {onlyPlayersNotInTheTournament
          .sort((a, b) => b.points - a.points)
          .map((player) => (
            <div
              key={player.playerId}
              onClick={() =>
                onSelectPlayerHandler(player.playerId, player.playerUid, player.name, player.points)
              }
              className={selectedPlayers_ids.includes(player.playerId) ? "selected-player" : "player"}
            >
              <span>{player.name}</span>&nbsp;-&nbsp;
              <span>{player.points}</span>
            </div>
          ))}
      </div>
    </>
  );
};

const findPlayerIndex = (playerId: string, players: RankedPlayers): number =>
  players.findIndex((player) => playerId === player.playerId);
