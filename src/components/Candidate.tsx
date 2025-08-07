import CandidateItem from "./CandidateItem";
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
    <div className="to-secondary bg-gradient-to-b from-[#4e131b]" id="thi-sinh">
      <div className="flex min-h-[800px] flex-col items-center justify-center gap-16 px-4 py-10">
        <div className="text-primary-foreground space-y-4 text-center">
          <PageTitle>Thí Sinh Xuất Sắc Nhất</PageTitle>
        </div>
        <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1">
          {CANDIDATES.map((candidate, index) => (
            <CandidateItem key={index} data={candidate} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Candidate;
