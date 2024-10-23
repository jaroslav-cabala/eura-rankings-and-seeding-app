import { CircleCheck } from "lucide-react";
import { FC, PropsWithChildren } from "react";

export const SuccessToastMessage: FC<PropsWithChildren> = ({ children }) => (
  <>
    <CircleCheck className="text-green-500 mr-3" />
    {children}
  </>
);
