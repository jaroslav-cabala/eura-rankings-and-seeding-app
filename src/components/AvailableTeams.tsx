import { Player } from "../hooks/types";
import { useGetAllAvailableTeams, useGetAllAvailableTeams2 } from "../hooks/useGetAllAvailableTeams";
import { useGetPlayersSortedByPointsOfTwoBestResults } from "../hooks/useGetPlayersSortedByPointsOfTwoBestResults";
import { ParticipatingTeam } from "./types";

type AvailableTeams = ReturnType<typeof useGetAllAvailableTeams>;

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
  // const teams = useGetAllAvailableTeams();
  const { data: availableTeams, loading, error } = useGetAllAvailableTeams2();

  const players = useGetPlayersSortedByPointsOfTwoBestResults();

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

  const onlyTeamsWithBothPlayersNotInTheTournament = availableTeams?.filter(
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
