import { div } from "motion/react-client";
import CandidateItem from "./CandidateItem";
import { GradientBackground } from "./ui/gradient";
import PageTitle from "./ui/title";

const CANDIDATES: ICandidate[] = [
	{
		name: "Thí sinh 1",
		description: "Mô tả về thí sinh 1",
		image: "/images/avatar.png",
	},
	{
		name: "Thí sinh 2",
		description: "Mô tả về thí sinh 2",
		image: "/images/avatar.png",
	},
	{
		name: "Thí sinh 3",
		description: "Mô tả về thí sinh 3",
		image: "/images/avatar.png",
	},
	{
		name: "Thí sinh 4",
		description: "Mô tả về thí sinh 4 Mô tả về thí sinh 4",
		image: "/images/avatar.png",
	},
];

const Candidate = () => {
	return (
		<GradientBackground id="thi-sinh">
			<div className="min-h-screen px-4 py-10 flex items-center justify-center flex-col gap-16">
				<div className="text-center space-y-4 text-primary-foreground">
					<PageTitle>Thí Sinh Xuất Sắc Nhất</PageTitle>
				</div>
				<div className="grid grid-cols-4 gap-8">
					{CANDIDATES.map((candidate, index) => (
						<CandidateItem key={index} data={candidate} />
					))}
				</div>
			</div>
		</GradientBackground>
	);
};
export default Candidate;
