import { RankedTournament } from "@/apiTypes";
import { Button } from "@/components/ui/button";
import { useFetchJsonData } from "@/hooks/useFetchData";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, loading, error } = useFetchJsonData<Array<RankedTournament>>(
    "http:localhost:3001/ranked-tournaments"
  );

  const getTournamentsFromFwango = async () => {
    try {
      const response = await fetch(new URL("http:localhost:3001/ranked-tournaments/from-fwango"));
      const json = await response.json();

      console.log("All ranked tournaments from fwango:");
      console.dir(json);
    } catch (error) {
      console.log("Error while requesting all ranked tournaments from fwango!");
    }
  };

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button variant={"outline"} className="my-4" onClick={getTournamentsFromFwango}>
        GET ALL RANKED TOURNAMENTS FROM FWANGO
      </Button>
      <ul>
        {data?.map((tournament, index) => (
          <li key={index}>
            {tournament.date} - {tournament.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
