import { useState } from "react";
import { AvailablePlayers } from "./components/AvailablePlayers";
import { AvailableTeams } from "./components/AvailableTeams";
import { ParticipatingTeam } from "./components/types";
import { TournamentDraw } from "./components/TournamentDraw";
import { Player } from "./hooks/types";
import { useGetAllAvailableTeams } from "./hooks/useGetAllAvailableTeams";
import { useGetPlayersSortedByPointsOfTwoBestResults } from "./hooks/useGetPlayersSortedByPointsOfTwoBestResults";
import "./Homepage.css";

export const Homepage = () => {
  const [participatingTeams, setParticipatingTeams] = useState<Array<ParticipatingTeam>>([]);

  const addTeamToTheTournament = (
    teamName: string,
    playerOne: Player,
    playerTwo: Player,
    points: number,
    teamId?: string
  ): void => {
    setParticipatingTeams((teams) => [
      ...teams,
      { id: teamId, name: teamName, playerOne, playerTwo, points },
    ]);
  };

  const importTeamsFromFwango = (): void => {
    const players = useGetPlayersSortedByPointsOfTwoBestResults();
    const teams = useGetAllAvailableTeams();

    // solve case where number of substring split by coma is not divisible by 3 -
    // team name or player's name is missing for some reason
    const importedTeamsCsvRows = testData.trim().split(/[\r\n]/);
    const importedTeams: Array<{ name: string; playerOne: string; playerTwo: string }> = [];
    for (const row of importedTeamsCsvRows) {
      const importedTeam = row.split(",");
      importedTeams.push({
        name: importedTeam[0].trim(),
        playerOne: importedTeam[1].trim(),
        playerTwo: importedTeam[2].trim(),
      });
    }

    const _participatingTeams: Array<ParticipatingTeam> = [];
    for (const importedTeam of importedTeams) {
      const existingTeam = teams.find(
        (team) =>
          team.name === importedTeam.name &&
          (team.playerOne.name === importedTeam.playerOne ||
            team.playerOne.name === importedTeam.playerTwo) &&
          (team.playerTwo.name === importedTeam.playerOne || team.playerTwo.name === importedTeam.playerTwo)
      );

      if (existingTeam) {
        _participatingTeams.push(existingTeam);
        continue; // team is found in the ranked teams, take the next team
      }

      // team is not found in the ranked teams, it is a new team.
      // But the players might be ranked so we need to look for them
      const existingPlayerOne = players.find((player) => player.name === importedTeam.playerOne);
      const existingPlayerTwo = players.find((player) => player.name === importedTeam.playerTwo);

      _participatingTeams.push({
        name: importedTeam.name,
        playerOne: existingPlayerOne
          ? {
              name: existingPlayerOne.name,
              id: existingPlayerOne.playerId,
              uid: existingPlayerOne.playerUid,
            }
          : { name: importedTeam.playerOne, id: "", uid: "" },
        playerTwo: existingPlayerTwo
          ? {
              name: existingPlayerTwo.name,
              id: existingPlayerTwo.playerId,
              uid: existingPlayerTwo.playerUid,
            }
          : { name: importedTeam.playerTwo, id: "", uid: "" },
        points: (existingPlayerOne?.points ?? 0) + (existingPlayerTwo?.points ?? 0),
      });
    }

    setParticipatingTeams(_participatingTeams);
  };

  const importTeamsFromFwango2 = async (importedTeams?: File): Promise<void> => {
    const formData = new FormData();
    if (importedTeams) {
      formData.append("importedTeamsFromFwango", importedTeams);

      const url = new URL("http:localhost:3001/tournament-draw/upload-teams-from-fwango");
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      console.log("import teams from fwango request - ", data);
    } else {
      console.log("file not specified, cannot import teams");
    }
  };

  return (
    <>
      <section className="available-players">
        <AvailablePlayers
          participatingTeams={participatingTeams}
          onTwoPlayersSelected={addTeamToTheTournament}
        />
      </section>
      <section className="available-teams">
        <AvailableTeams participatingTeams={participatingTeams} onSelectTeam={addTeamToTheTournament} />
      </section>
      <section className="tournament-draw">
        <TournamentDraw
          participatingTeams={participatingTeams}
          importTeamsFromFwangoHandler={importTeamsFromFwango2}
        />
      </section>
    </>
  );
};

const testData = `
Super team A,Michael Leuwig,Peter Choi
Hustling Brothers, Levi Vandaele, Yosha Vandaele
Team 3,Jakub Víšek,Ondřej Čejka
Team 2,Ondra Kasan,Jaroslav Čabala
Eisenträger/Siemer,Paul Siemer, Eisenträger Lukas
RCG Powerline,Nelson Dziruni, Benjamin Bachler
Pour Combien ?,Robin Florinda, Dorian Améziane
nerds in disguise,Stefan Handschmann, David Jindra
Willy Wonka,Emil Grönebaum, Rasmus Prüfer
Czech this swede,Ondřej Čejka, Esaja Ekman
Pierre Feuille Victor,Aymeric Sandoz, Pierre Lecrosnier,
Elbourne/Hatas,Mark Elbourne, Dominik Hataš`;
