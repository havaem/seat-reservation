import { PropsWithChildren } from "react";
import { Typography } from "./typography";

const PageTitle: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Typography
        type="h2"
        className="text-white drop-shadow-md sm:text-4xl md:text-5xl"
      >
        {children}
      </Typography>
      <div className="mx-auto mt-4 h-1 w-64 rounded-full bg-gradient-to-r from-[#ffd39b] via-white/70 to-[#ffd39b]" />
    </div>
  );
};
export default PageTitle;
