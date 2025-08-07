import { PropsWithChildren } from "react";
import { Typography } from "./typography";

const PageTitle: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="relative">
			<div className="absolute -inset-x-2 -bottom-3 h-1 bg-gradient-to-r from-primary to-secondary"></div>
			<Typography type="h2" className="uppercase relative text-foreground">
				{children}
			</Typography>
		</div>
	);
};
export default PageTitle;
