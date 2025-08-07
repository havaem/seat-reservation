import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Typography } from "./ui/typography";

interface Props {
	data: ICandidate;
}
const CandidateItem: React.FC<Props> = ({ data }) => {
	return (
		<Card className="border-2 w-full max-w-[250px] relative h-72 hover:border-primary transition-all cursor-pointer p-0">
			<CardContent className="flex flex-col items-center gap-4 h-full p-6">
				<Image
					src={data.image}
					alt={data.name}
					width={100}
					height={100}
					className="rounded-full aspect-square object-cover"
				/>
				<div className="mt-auto flex flex-col gap-4 items-center justify-center">
					<Typography type="h3">{data.name}</Typography>
					<Typography className="line-clamp-2 min-h-14">{data.description}</Typography>
				</div>
			</CardContent>
		</Card>
	);
};
export default CandidateItem;
