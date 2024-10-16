import { CircleAlert } from "lucide-react";
import { FC, PropsWithChildren } from "react";

export const ErrorToastMessage: FC<PropsWithChildren> = ({ children }) => (
  <>
    <CircleAlert className="text-red-500 mr-3" />
    {children}
  </>
);
