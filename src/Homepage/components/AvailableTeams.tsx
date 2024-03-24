import { Player } from "../hooks/types";
import { useGetAllAvailableTeams, useGetAllAvailableTeams2 } from "../hooks/useGetAllAvailableTeams";
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

  // use Set since duplicates are not allowed
  // const [availableTeams, setAvailableTeams] = useState<AvailableTeams>(teams);

  const onSelectTeamHandler = (
    teamId: string,
    teamName: string,
    playerOne: Player,
    playerTwo: Player,
    points: number,
    index: number
  ) => {
    // setAvailableTeams((teams) => {
    //   const updatedTeams = [...teams];
    //   updatedTeams.splice(index, 1);
    //   return updatedTeams;
    // });
    props.onSelectTeam(teamName, playerOne, playerTwo, points, teamId);
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
                onSelectTeamHandler(
                  team.teamId,
                  team.name,
                  team.playerOne,
                  team.playerTwo,
                  team.points,
                  index
                )
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
