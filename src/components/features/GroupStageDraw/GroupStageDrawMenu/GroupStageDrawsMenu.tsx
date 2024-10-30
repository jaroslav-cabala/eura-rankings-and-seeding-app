import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftToLine, ArrowRightToLine, SquarePlus, Trash2 } from "lucide-react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GroupStageDrawNameAndIdDTO } from "@/api/apiTypes";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/hooks/use-toast";
import { ErrorToastMessage } from "../../../common/ErrorToastMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGroupStageDrawMenuContext } from "./GroupStageDrawMenuContext";

export const GroupStageDrawsMenu = () => {
  console.dir(`GroupStageDrawsMenu`);
  // console.dir(groupStageDrawsInitial);
  const navigate = useNavigate();
  const { menuItems, setMenuItems } = useGroupStageDrawMenuContext();
  const [createNewDrawInitiated, setCreateNewDrawInitiated] = useState(false);

  // TODO extract to a hook
  const createNewGroupStageDraw = async () => {
    setCreateNewDrawInitiated(true);

    const result = await fetch(`http://localhost:3001/groupstage-draws`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // TODO create a type on frontend and backend
    const [id, name, modified]: [id: string, name: string, modified: number] = await result.json();

    setMenuItems([...menuItems, { id, name, modified }]);

    navigate({ to: `/group-stage-draws/${id}` });

    setCreateNewDrawInitiated(false);
  };

  const deleteGroupStageDraw = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/groupstage-draws/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMenuItems(menuItems.filter((menuItem) => menuItem.id !== id));
    } catch (error) {
      toast({
        description: (
          <ErrorToastMessage>
            An unexpected error occured. Could not delete a group stage draw.
          </ErrorToastMessage>
        ),
      });
    }
  };

  const groupStageDrawsSorted = [...menuItems].sort((a, b) => b.modified - a.modified);

  return (
    <>
      <SheetVariant
        menuItems={groupStageDrawsSorted}
        createNewDrawHandler={createNewGroupStageDraw}
        deleteDrawHandler={deleteGroupStageDraw}
        createNewDrawInitiated={createNewDrawInitiated}
        className="lg:hidden"
      />
      <SidebarVariant
        menuItems={groupStageDrawsSorted}
        createNewDrawHandler={createNewGroupStageDraw}
        deleteDrawHandler={deleteGroupStageDraw}
        createNewDrawInitiated={createNewDrawInitiated}
        className="hidden lg:block"
      />
    </>
  );
};

const SidebarVariant = ({
  menuItems,
  createNewDrawHandler,
  deleteDrawHandler,
  createNewDrawInitiated,
  className,
}: {
  menuItems: Array<GroupStageDrawNameAndIdDTO>;
  createNewDrawHandler: () => void;
  deleteDrawHandler: (id: string) => void;
  createNewDrawInitiated: boolean;
  className?: string;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const routerState = useRouterState();
  const isIndexLocation = routerState.location.pathname === "/group-stage-draws";

  return (
    <aside
      className={cn(
        `pr-3 text-center ${isMenuOpen ? "h-[calc(100vh-92px)] min-w-[320px] max-w-[320px] lg:min-w-[360px] lg:max-w-[360px] superwide:max-w-[450px]" : "w-auto mr-8"}`,
        className
      )}
    >
      {!isIndexLocation ? (
        isMenuOpen ? (
          <div className="h-[35px] mb-5 flex justify-between">
            <h2 className="title">Group stage draws:</h2>
            <MenuToggle icon={<ArrowLeftToLine />} setIsMenuOpen={setIsMenuOpen} />
          </div>
        ) : (
          <div className="h-[35px] flex justify-between">
            <MenuToggle icon={<ArrowRightToLine />} setIsMenuOpen={setIsMenuOpen} />
          </div>
        )
      ) : (
        <h2 className="title text-left h-[35px] mb-5">Group stage draws:</h2>
      )}
      {isMenuOpen && (
        <>
          <Button
            className="w-full shadow-sm py-1.5 px-4 mb-5"
            disabled={createNewDrawInitiated}
            onClick={createNewDrawHandler}
          >
            <SquarePlus className="w-6 mr-2" /> Create new
          </Button>
          <ScrollArea className="h-[calc(100%-135px)]">
            <div className="flex flex-col mb-6 text-left">
              {menuItems?.map((menuItem) => (
                <GroupStageDrawsMenuLink
                  key={menuItem.id}
                  groupStageDrawId={menuItem.id}
                  name={menuItem.name}
                  deleteDrawHandler={deleteDrawHandler}
                />
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </aside>
  );
};

const MenuToggle = ({
  icon,
  className,
  setIsMenuOpen,
}: {
  icon: React.JSX.Element;
  className?: string;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Button
      variant="icon"
      size="icon"
      className={cn("justify-self-end hover:bg-[hsl(var(--accent))]", className)}
      onClick={() => setIsMenuOpen((val) => !val)}
    >
      {icon}
    </Button>
  );
};

const SheetVariant = ({
  menuItems,
  createNewDrawHandler,
  deleteDrawHandler,
  createNewDrawInitiated,
  className,
}: {
  menuItems: Array<GroupStageDrawNameAndIdDTO>;
  createNewDrawHandler: () => void;
  deleteDrawHandler: (id: string) => void;
  createNewDrawInitiated: boolean;
  className?: string;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const routerState = useRouterState();
  const isIndexLocation = routerState.location.pathname === "/group-stage-draws";
  const centeredContentCss = "fixed flex top-0 left-0 w-full h-full items-center";

  return (
    <div className={cn(`${isIndexLocation && centeredContentCss}`, className)}>
      <div className="flex items-center gap-6 m-auto">
        <Button
          variant="outline"
          className="shadow-sm py-1.5 px-4"
          onClick={() => setIsMenuOpen((val) => !val)}
        >
          Select a group stage draw
        </Button>
        <span className="font-bold text-lg">or</span>
        <Button className="py-1.5 px-4" disabled={createNewDrawInitiated} onClick={createNewDrawHandler}>
          <SquarePlus className="w-6 mr-2" /> Create new
        </Button>
      </div>
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="mb-4">Group stage draws:</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[95%] pr-3">
            <SheetDescription>
              <div className="flex flex-col text-left">
                {menuItems?.map((menuItem) => (
                  <GroupStageDrawsMenuLink
                    key={menuItem.id}
                    groupStageDrawId={menuItem.id}
                    name={menuItem.name}
                    deleteDrawHandler={deleteDrawHandler}
                    linkClickHandler={() => setIsMenuOpen(false)}
                  />
                ))}
              </div>
            </SheetDescription>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const GroupStageDrawsMenuLink: FC<{
  groupStageDrawId: string;
  name: string;
  deleteDrawHandler: (id: string) => void;
  linkClickHandler?: () => void;
}> = ({ groupStageDrawId, name, deleteDrawHandler, linkClickHandler }) => {
  return (
    <Link
      key={groupStageDrawId}
      to={`/group-stage-draws/${groupStageDrawId}`}
      preload="intent"
      onClick={linkClickHandler}
      className="group-stage-draws-menu-link flex items-center justify-between rounded-md font-medium h-10 py-[0.375rem] px-3 text-muted-foreground/85 [&.active]:text-primary [&.active]:shadow-sm [&.active]:bg-accent hover:text-primary"
    >
      {({ isActive }) => (
        <>
          <span className="overflow">{name}</span>
          {!isActive && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                deleteDrawHandler(groupStageDrawId);
              }}
              title="Delete draw"
              size="icon_small"
              variant="icon"
              className="hidden hover:text-[hsl(var(--destructive))]"
            >
              <Trash2 />
            </Button>
          )}
        </>
      )}
    </Link>
  );
};
