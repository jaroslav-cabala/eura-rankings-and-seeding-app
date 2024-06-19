import { useState } from "react";
import { AvailablePlayers } from "./AvailablePlayers";
import { AvailableTeams } from "./AvailableTeams";
import { ParticipatingTeam } from "./types";
import { TournamentDraw } from "./TournamentDraw";
import { Player } from "../hooks/types";
import { useGetAllAvailableTeams } from "../hooks/useGetAllAvailableTeams";
import { useGetPlayersSortedByPointsOfTwoBestResults } from "../hooks/useGetPlayersSortedByPointsOfTwoBestResults";
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

  const importTeamsFromFwango = async (importedTeamsFile?: File): Promise<void> => {
    const players = useGetPlayersSortedByPointsOfTwoBestResults();
    const teams = useGetAllAvailableTeams();

    if (importedTeamsFile) {
      // solve case where number of substring split by coma is not divisible by 3 -
      // team name or player's name is missing for some reason
      const importedTeamsFileContents = await importedTeamsFile.text();
      const importedTeamsCsvRows = importedTeamsFileContents.trim().split(/[\n]/);
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
          const existingPlayerOne = players.find((player) => player.name === importedTeam.playerOne);
          const existingPlayerTwo = players.find((player) => player.name === importedTeam.playerTwo);

          _participatingTeams.push({
            id: existingTeam.teamUid,
            name: existingTeam.name,
            playerOne: existingTeam.playerOne,
            playerTwo: existingTeam.playerTwo,
            points: (existingPlayerOne?.points ?? 0) + (existingPlayerTwo?.points ?? 0),
          });
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

      const formData = new FormData();
      formData.append("importedTeamsFromFwango", importedTeamsFile);

      const url = new URL("http:localhost:3001/tournament-draw/upload-teams-from-fwango");
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      console.log("import teams from fwango request successful - ", formData);
    } else {
      console.log("file not specified, cannot import teams");
    }
  };

  const resetTournament = (): void => {
    setParticipatingTeams([]);
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
          importTeamsFromFwangoHandler={importTeamsFromFwango}
          resetTournamentHandler={resetTournament}
        />
      </section>
    </>
  );
};

const testData = `Super team A,Michael Leuwig,Peter Choi
Team 3,Jakub Víšek,Ondřej Čejka
Team 2,Ondra Kasan,Jaroslav Čabala
Hustling Brothers, Levi Vandaele, Yosha Vandaele
Eisenträger/Siemer,Paul Siemer, Eisenträger Lukas
RCG Powerline,Nelson Dziruni, Benjamin Bachler
Pour Combien ?,Robin Florinda, Dorian Améziane
nerds in disguise,Stefan Handschmann, David Jindra
Willy Wonka,Emil Grönebaum, Rasmus Prüfer
Czech this swede,Ondřej Čejka, Esaja Ekman
Pierre Feuille Victor,Aymeric Sandoz,Pierre Lecrosnier,
Paindrops,Yvo Heinen,Markus Anderle,
Rainbow Warriors,Fabian Claus,Josha Lauterbach
Christiani/Krehle,Lucas Christiani,Julian Krehle
Hors Service,Hugo Lacombe, Samy Caux-Ramon`;
