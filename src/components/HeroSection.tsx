"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Fingerprint, LocateIcon } from "lucide-react";
import Image from "next/image";

import Clock from "./Clock";
import heroImage from "./hero.jpg";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useCallback } from "react";

const eventInfo = [
  {
    icon: <Calendar className="text-primary-foreground h-6 w-6" />,
    title: "Thời Gian",
    desc: (
      <>
        Chủ nhật, 7 tháng 9, 2025 <br />
        18:00 - 22:00
      </>
    ),
  },
  {
    icon: <LocateIcon className="text-primary-foreground h-6 w-6" />,
    title: "Địa điểm",
    desc: "Hội trường khách sạn Hải Âu Biên Cương",
    iconRight: true,
  },
];

const HeroSection = () => {
  const handleScrollToThiSinh = useCallback(() => {
    const el = document.getElementById("thi-sinh");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center py-6 md:py-8 lg:min-h-[740px] lg:py-10">
      <div className="bg-primary absolute inset-0 -z-10">
        <div className="bg-foreground absolute inset-0 opacity-70"></div>
        <Image
          className="h-full w-full object-cover"
          src={heroImage}
          alt="Hero Image"
          priority
        />
      </div>

      <motion.div className="flex h-full w-full flex-col items-center justify-center gap-8">
        <motion.h2
          className="text-background text-center text-4xl max-lg:text-3xl max-md:flex max-md:flex-col"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>CHUNG KẾT</span>
          <span className="text-secondary font-sans text-5xl font-extrabold max-lg:text-4xl max-md:my-4 md:mx-2">
            ĐẤT VÕ TRỜI VĂN
          </span>
          <span>MÙA 3</span>
        </motion.h2>
        <motion.div
          className={cn(
            "grid max-w-[800px] grid-cols-2 gap-8 max-lg:max-w-[700px] max-md:hidden",
          )}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {eventInfo.map(({ icon, title, desc, iconRight }, i) => (
            <Card key={i}>
              <CardContent
                className={cn(
                  "flex items-center gap-4",
                  iconRight ? "flex-row-reverse text-right" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "bg-primary order-1 flex aspect-square w-10 flex-shrink-0 items-center justify-center rounded-full",
                    iconRight ? "ml-auto" : "mr-4",
                  )}
                >
                  {icon}
                </div>
                <div className="order-2">
                  <p className="text-lg font-semibold md:text-xl">{title}</p>
                  <p>{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
        <motion.div
          className="mt-10 flex flex-col justify-center gap-4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Clock />
          <Button
            variant="secondary"
            className="rounded-none py-8 text-2xl font-bold uppercase transition-all hover:scale-120 hover:brightness-110"
            onClick={handleScrollToThiSinh}
          >
            <Fingerprint className="mr-2 inline-block h-10 w-10" />
            Đặt vé ngay
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default HeroSection;
