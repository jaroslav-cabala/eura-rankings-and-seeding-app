import { Group } from "./TournamentDraw";

export const Groups = ({ groups, powerpools }: { groups?: Array<Group>; powerpools?: Array<Group> }) => {
  return (
    <div className="groups">
      {powerpools?.map((powerpool, index) => (
        <div className="powerpool" key={`powerpool${index}`}>
          <p className="title">Powerpool {getGroupLetter(index)}</p>
          <ol>
            {powerpool.teams.map((team) => (
              <li className="teamname" key={team.id ?? `${team.players[0].name}_${team.players[1].name}`}>
                <span>{`${team.name} `}</span>
                <span className="lowlighted-text">{`${team.points} points`}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
      {groups?.map((group, index) => (
        <div className="group" key={`group${index}`}>
          <p className="title">Group {getGroupLetter(index)}</p>
          <ol>
            {group.teams.map((team) => (
              <li className="teamname" key={team.id ?? `${team.players[0].name}_${team.players[1].name}`}>
                <span>{`${team.name}`}&nbsp;&nbsp;</span>
                <span className="lowlighted-text">{`(${team.points} points)`}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
};

// get a letter for a group, starting from 'A' for index = 0.
// For index = 1, letter B is returned, etc. in alphabetical order based on utf-16 decimal encoding codes.
// When letter Z is reached(decimal code 95), 2 letters are returned starting with AA.
const getGroupLetter = (index: number): string => {
  const numberOfLetters = Math.ceil((index + 1) / 26);
  const decimalEncodingCode = index % 26;
  return String.fromCharCode(...Array(numberOfLetters).fill(65 + decimalEncodingCode));
};
