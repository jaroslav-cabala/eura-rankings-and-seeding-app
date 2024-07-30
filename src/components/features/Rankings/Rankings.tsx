import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RankedEntity } from "@/domain";
import { capitalizeFirstChar } from "@/utils";
import { IndividualRankings } from "./IndividualRankings";
import { TeamRankings } from "./TeamRankings";

export const Rankings = () => {
  console.log("Rankings component");

  return (
    <main className="container max-w-fit">
      <Tabs defaultValue={RankedEntity.Individual} className="">
        <TabsList className="items-center w-[1200px]">
          <TabsTrigger value={RankedEntity.Individual}>
            {capitalizeFirstChar(RankedEntity.Individual)} Rankings
          </TabsTrigger>
          <TabsTrigger value={RankedEntity.Team}>
            {capitalizeFirstChar(RankedEntity.Team)} Rankings
          </TabsTrigger>
        </TabsList>
        <TabsContent value={RankedEntity.Individual}>
          <IndividualRankings />
        </TabsContent>
        <TabsContent value={RankedEntity.Team}>
          <TeamRankings />
        </TabsContent>
      </Tabs>
    </main>
  );
};
