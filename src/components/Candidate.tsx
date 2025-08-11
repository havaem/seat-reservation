"use client";

import { motion } from "motion/react";
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
    <section
      className="to-secondary scroll-mt-20 bg-gradient-to-b from-[#4e131b]"
      id="thi-sinh"
    >
      <div className="flex min-h-[800px] flex-col items-center justify-center gap-16 px-4 py-10">
        <div className="text-primary-foreground space-y-4 text-center">
          {/* <PageTitle>4 Thí Sinh Xuất Sắc Nhất</PageTitle> */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <PageTitle>
              4 Thí Sinh Xuất Sắc –{" "}
              <span className="font-extrabold text-[#FFD39B]">
                Bạn Sẽ Ủng Hộ Ai?
              </span>
            </PageTitle>

            {/* decorative underline */}

            <p className="mt-5 text-base text-white/85 sm:text-lg">
              Chỉ một đêm duy nhất. Trực tiếp chứng kiến cuộc đua đỉnh cao
              &mdash; đừng bỏ lỡ!
            </p>
          </motion.div>
        </div>
        <div className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1">
          {CANDIDATES.map((candidate) => (
            <CandidateItem key={candidate.name} data={candidate} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Candidate;
