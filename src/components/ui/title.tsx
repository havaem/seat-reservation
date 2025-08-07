import { PropsWithChildren } from "react";
import { Typography } from "./typography";

const PageTitle: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative">
      <div className="from-primary to-secondary absolute -inset-x-2 -bottom-3 h-1 bg-gradient-to-b"></div>
      <Typography
        type="h2"
        className="text-background relative font-sans font-extrabold uppercase"
      >
        {children}
      </Typography>
    </div>
  );
};
export default PageTitle;
