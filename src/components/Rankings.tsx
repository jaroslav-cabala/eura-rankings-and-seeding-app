import { Division } from "../domain";
import { useGetRankedPlayers } from "../hooks/useGetRankedPlayers";
import { useGetRankedTeams } from "../hooks/useGetRankedTeams";
import "./Rankings.css";

export const Rankings = () => {
  console.log("Rankings component");
  const {
    data: availablePlayers,
    loading: playersLoading,
    error: playersError,
  } = useGetRankedPlayers(Division.Open);
  const { data: availableTeams, loading: teamsLoading, error: teamsError } = useGetRankedTeams(Division.Open);

  return (
    <main>
      <article className="container">
        <div className="ranking">
          {playersLoading ? (
            <p>loading open player rankings</p>
          ) : (
            <>
              <p className="title">Open Individual {availablePlayers.length}</p>
              {availablePlayers
                .sort((a, b) => b.points - a.points)
                .map((player, index) => (
                  <div key={player.playerId} className="">
                    {index + 1}. <span>{player.name}</span>&nbsp;-&nbsp;
                    <span>{player.points}</span>
                  </div>
                ))}
            </>
          )}
        </div>
        <div className="ranking">
          {teamsLoading ? (
            <p>loading open team rankings</p>
          ) : (
            <>
              <p className="title">Open Teams {availableTeams.length}</p>
              {availableTeams
                .sort((a, b) => b.points - a.points)
                .map((team, index) => (
                  <div key={team.teamUid} className="">
                    {index + 1}. <span>{team.name}</span>&nbsp;-&nbsp;
                    <span>{team.points}</span>
                  </div>
                ))}
            </>
          )}
        </div>
      </article>
    </main>
  );
};
