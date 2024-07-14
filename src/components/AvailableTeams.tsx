import { Player } from "../apiTypes";
import { Division } from "../domain";
import { useGetRankedPlayers } from "../hooks/useGetRankedPlayers";
import { useGetRankedTeams } from "../hooks/useGetRankedTeams";
import { ParticipatingTeam } from "./types";

type AvailableTeams = ReturnType<typeof useGetRankedTeams>;

export const AvailableTeams = (props: {
  participatingTeams: Array<ParticipatingTeam>;
  onSelectTeam: (
    teamName: string,
    playerOne: Player,
    playerTwo: Player,
    points: number,
    teamId?: string
  ) => void;
}) => {
  const {
    data: rankedTeams,
    loading: loadingRankedTeams,
    error: errorRankedTeams,
  } = useGetRankedTeams(Division.Open);
  const { data: players, loading, error } = useGetRankedPlayers(Division.Open);

  // use Set since duplicates are not allowed
  // const [availableTeams, setAvailableTeams] = useState<AvailableTeams>(teams);

  const onSelectTeamHandler = (
    teamId: string,
    teamName: string,
    playerOne: Player,
    playerTwo: Player,
    index: number
  ) => {
    // setAvailableTeams((teams) => {
    //   const updatedTeams = [...teams];
    //   updatedTeams.splice(index, 1);
    //   return updatedTeams;
    // });
    const existingPlayerOne = players.find((player) => player.name === playerOne.name);
    const existingPlayerTwo = players.find((player) => player.name === playerTwo.name);
    props.onSelectTeam(
      teamName,
      playerOne,
      playerTwo,
      (existingPlayerOne?.points ?? 0) + (existingPlayerTwo?.points ?? 0),
      teamId
    );
  };

  if (loading) {
    return <div className="">LOADING RANKED TEAMS</div>;
  }

  if (error) {
    return <div className="">ERROR WHILE LOADING RANKED TEAMS</div>;
  }

  const onlyTeamsWithBothPlayersNotInTheTournament = rankedTeams?.filter(
    (availableTeam) =>
      !props.participatingTeams.find(
        (participatingTeam) =>
          availableTeam.playerOne.uid === participatingTeam.playerOne.uid ||
          availableTeam.playerTwo.uid === participatingTeam.playerOne.uid ||
          availableTeam.playerOne.uid === participatingTeam.playerTwo.uid ||
          availableTeam.playerTwo.uid === participatingTeam.playerTwo.uid
      )
  );

  return (
    <>
      <div className="">
        <p className="title">Available teams {onlyTeamsWithBothPlayersNotInTheTournament?.length}</p>
        {onlyTeamsWithBothPlayersNotInTheTournament
          ?.sort((a, b) => b.points - a.points)
          .map((team, index) => (
            <div
              key={team.teamId}
              onClick={() =>
                onSelectTeamHandler(team.teamId, team.name, team.playerOne, team.playerTwo, index)
              }
              className=""
            >
              <span>{team.name}</span>&nbsp;-&nbsp;
              <span>{team.points}</span>
            </div>
          ))}
      </div>
    </>
  );
};
