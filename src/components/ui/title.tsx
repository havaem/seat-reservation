import { PropsWithChildren } from "react";
import { Typography } from "./typography";
import { cn } from "@/lib/utils";

type Props = PropsWithChildren<{
  className?: string;
}>;
const PageTitle: React.FC<Props> = ({ children, className }) => {
  return (
    <div>
      <Typography
        type="h2"
        className={cn(`drop-shadow-md sm:text-4xl md:text-5xl`, className)}
      >
        {children}
      </Typography>
      <div className="mx-auto mt-4 h-1 w-64 rounded-full bg-gradient-to-r from-[#ffd39b] via-white/70 to-[#ffd39b]" />
    </div>
  );
};
export default PageTitle;
