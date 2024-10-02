import { TournamentDrawTeam } from "./GroupStageDraw";

export const Groups = ({
  groups,
  powerpools,
}: {
  groups: Array<Array<TournamentDrawTeam>>;
  powerpools: Array<Array<TournamentDrawTeam>>;
}) => {
  return (
    <>
      <div className="title mb-6">
        <h1>Groups</h1>
      </div>
      {!!powerpools?.length && (
        <div className="flex flex-wrap gap-6 mb-6">
          {powerpools.map((powerpool, index) => (
            <div className="powerpool shadow-sm" key={`powerpool${index}`}>
              <p className="title mb-6 mt-2 px-3">Powerpool {getGroupLetter(index)}</p>
              <ol>
                {powerpool.map((team) => (
                  <li
                    className="py-1 px-3 mb-2"
                    key={team.uid ?? `${team.players[0].name}_${team.players[1].name}`}
                  >
                    <span className="font-medium">{`${team.name} `}</span>
                    <span className="grey-text">{`${team.points} points`}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
      {!!groups?.length && (
        <div className="flex flex-wrap gap-6">
          {groups?.map((group, index) => (
            <div className="group shadow-sm" key={`group${index}`}>
              <p className="title mb-6 mt-2 px-3">Group {getGroupLetter(index)}</p>
              <ol>
                {group.map((team) => (
                  <li
                    className="py-1 px-3 mb-2"
                    key={team.uid ?? `${team.players[0].name}_${team.players[1].name}`}
                  >
                    <span className="font-medium">{`${team.name}`}&nbsp;&nbsp;</span>
                    <span className="grey-text">{`(${team.points} points)`}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
      {!groups?.length && !powerpools?.length && (
        <div className="p-10 text-center text-muted-foreground">No teams in the tournament. Add some!</div>
      )}
    </>
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
