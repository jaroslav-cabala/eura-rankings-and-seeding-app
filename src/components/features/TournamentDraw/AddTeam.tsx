import { FC, useState } from "react";
import { Player } from "@/api/apiTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Team = { name: string; playerOne?: Player; playerTwo?: Player };

type AddTeamProps = {
  addTeamHandler: () => void;
};
export const AddTeam: FC<AddTeamProps> = ({ addTeamHandler }) => {
  const [team, setTeam] = useState<Team>();

  return (
    <div id="add-team" className="mb-2">
      <Input
        value={team?.name}
        onChange={(event) => setTeam({ ...team, name: event.currentTarget.value } as Team)}
        placeholder="Team name"
      />
      <Input
        value={team?.playerOne?.name}
        onChange={(event) =>
          setTeam({ ...team, playerOne: { ...team?.playerOne, name: event.currentTarget.value } } as Team)
        }
        placeholder="Player name"
      />
      <Input
        value={team?.playerTwo?.name}
        onChange={(event) =>
          setTeam({ ...team, playerTwo: { ...team?.playerTwo, name: event.currentTarget.value } } as Team)
        }
        placeholder="Player name"
      />
      <Button variant="default" onClick={addTeamHandler}>
        Create team
      </Button>
    </div>
  );
};
