import { Group } from "./GroupStage";

export const Groups = ({ groups, powerpools }: { groups?: Array<Group>; powerpools?: Array<Group> }) => {
  return (
    <section className="groups">
      {powerpools?.map((powerpool, index) => (
        <div className="powerpool">
          <p className="title">Powerpool {index + 1}</p>
          <ol>
            {powerpool.teams.map((team) => (
              <li key={team.id}>
                <span>{`${team.name} - ${team.points}`} </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
      {groups?.map((group, index) => (
        <div className="group">
          <p className="title">Group {index + 1}</p>
          <ol>
            {group.teams.map((team) => (
              <li key={team.id}>
                <span>{`${team.name} - ${team.points}`}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
};
