import { TournamentDrawTeam } from "./TournamentDraw";

export const Groups = ({
  groups,
  powerpools,
}: {
  groups?: Array<Array<TournamentDrawTeam>>;
  powerpools?: Array<Array<TournamentDrawTeam>>;
}) => {
  return (
    <div className="groups">
      {powerpools?.map((powerpool, index) => (
        <div className="powerpool" key={`powerpool${index}`}>
          <p className="title mb-5 px-3">Powerpool {getGroupLetter(index)}</p>
          <ol>
            {powerpool.map((team) => (
              <li
                className="py-1 px-3 mb-2 last:mb-0"
                key={team.uid ?? `${team.players[0].name}_${team.players[1].name}`}
              >
                <span className="font-medium">{`${team.name} `}</span>
                <span className="lowlighted-text">{`${team.points} points`}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
      {groups?.map((group, index) => (
        <div className="group" key={`group${index}`}>
          <p className="title mb-5 px-3">Group {getGroupLetter(index)}</p>
          <ol>
            {group.map((team) => (
              <li
                className="py-1 px-3 mb-2 last:mb-0"
                key={team.uid ?? `${team.players[0].name}_${team.players[1].name}`}
              >
                <span className="font-medium">{`${team.name}`}&nbsp;&nbsp;</span>
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
