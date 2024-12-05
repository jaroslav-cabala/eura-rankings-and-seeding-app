import { GroupStageDrawNameIdModifiedDTO } from "@/api/apiTypes";
import React, { createContext, useContext, useState } from "react";

interface GroupStageDrawMenuContext {
  menuItems: Array<GroupStageDrawNameIdModifiedDTO>;
  setMenuItems: React.Dispatch<React.SetStateAction<GroupStageDrawMenuContext["menuItems"]>>;
}

export const GroupStageDrawMenuContext = createContext<GroupStageDrawMenuContext | null>(null);

export const useGroupStageDrawMenuContext = () => {
  const context = useContext(GroupStageDrawMenuContext);

  if (!context) {
    throw new Error(
      `${useGroupStageDrawMenuContext.name} must be used within a ${GroupStageDrawMenuContextProvider.name}`
    );
  }

  return context;
};

export const GroupStageDrawMenuContextProvider = ({
  children,
  groupStageDraws,
}: React.PropsWithChildren<{ groupStageDraws: Array<GroupStageDrawNameIdModifiedDTO> }>) => {
  const [menuItems, setMenuItems] = useState<GroupStageDrawMenuContext["menuItems"]>(groupStageDraws);

  return (
    <GroupStageDrawMenuContext.Provider value={{ menuItems, setMenuItems }}>
      {children}
    </GroupStageDrawMenuContext.Provider>
  );
};
