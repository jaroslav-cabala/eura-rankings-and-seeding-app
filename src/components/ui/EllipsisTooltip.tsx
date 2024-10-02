import { FC, useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

type OverflowTooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
};

// TODO make this work when resizing viewport
export const OverflowTooltip: FC<OverflowTooltipProps> = ({ children, content, ...props }) => {
  const [displayTooltip, setDisplayTooltip] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientWidth = ref.current?.children[0].children[0].clientWidth;
    const scrollWidth = ref.current?.children[0].children[0].scrollWidth;

    if (clientWidth && scrollWidth && clientWidth < scrollWidth) {
      setDisplayTooltip(true);
    } else {
      setDisplayTooltip(false);
    }
  }, []);
  return (
    <TooltipProvider>
      <Tooltip
        delayDuration={0}
        open={openTooltip}
        onOpenChange={(open) => setOpenTooltip(displayTooltip && open)}
      >
        <TooltipTrigger>
          <div ref={ref}>{children}</div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" {...props}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
