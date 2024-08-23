import { Division, Category } from "./domain";

export const apiEndpoints = {
  openRankingsTeams: "rankings/open/teams",
  womenRankingsTeams: "rankings/women/teams",
  mixedRankingsTeams: "rankings/mixed/teams",
  openRankingsPlayers: "rankings/open/players",
  womenRankingsPlayers: "rankings/women/players",
  mixedRankingsPlayers: "rankings/mixed/players",
};

export const RANKING_IDS = {
  openpro24: "6426f23b6fa0965f30d16527",
  opencontender24: "6467acc2bfd71dd46a6a8416",
  womenpro24: "6426f6148cd49f63a82a49ed",
  womencontender24: "660e8feecbe4a7bef05c8662",
  mixedpro24: "65de30b63426ef98a031cde5",
  mixedadvanced24: "660e9038cbe4a7bef05c8689",
} as const;

export type RANKING_ID = (typeof RANKING_IDS)[keyof typeof RANKING_IDS];

export const rankingIdsMetadataMap: Record<RANKING_ID, { division: Division; category: Category }> = {
  [RANKING_IDS.openpro24]: { division: Division.Pro, category: Category.Open },
  [RANKING_IDS.womenpro24]: { division: Division.Pro, category: Category.Women },
  [RANKING_IDS.mixedpro24]: { division: Division.Pro, category: Category.Mixed },
  [RANKING_IDS.opencontender24]: {
    division: Division.Contender,
    category: Category.Open,
  },
  [RANKING_IDS.womencontender24]: {
    division: Division.Contender,
    category: Category.Women,
  },
  [RANKING_IDS.mixedadvanced24]: {
    division: Division.Contender,
    category: Category.Mixed,
  },
};

export type GroupDrawMethod = "snake";

export const tournamentDrawDefaults: {
  numberOfResultsCountedToPointsTotal: number;
  groupDrawMethod: GroupDrawMethod;
} = {
  numberOfResultsCountedToPointsTotal: 2,
  groupDrawMethod: "snake",
};
