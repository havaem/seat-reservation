"use client";

import { motion } from "motion/react";
import CandidateItem from "./CandidateItem";
import PageTitle from "./ui/title";
import Image from "next/image";
import React from "react";
const CANDIDATES: ICandidate[] = [
  {
    name: "Nguyễn Cao Thành Nhơn",
    image: "/images/nguyen-cao-thanh-nhon.JPG",
  },
  {
    name: "Đỗ Thanh Phương",
    image: "/images/do-thanh-phuong.JPG",
  },
  {
    name: "Nguyễn Minh Tài",
    image: "/images/nguyen-minh-tai.JPG",
  },
  {
    name: "Nguyễn Quốc Dân",
    image: "/images/nguyen-quoc-dan.JPG",
  },
];

const Candidate = () => {
  return (
    <section id="thi-sinh">
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
            <PageTitle className="text-white">
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
        <Image
          src={"/images/4-thi-sinh.JPG"}
          alt={"4 Thí Sinh Xuất Sắc"}
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full max-w-3xl rounded-lg object-cover"
        />
      </div>
    </section>
  );
};
export default Candidate;
