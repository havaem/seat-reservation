"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Fingerprint, LocateIcon } from "lucide-react";
import Image from "next/image";
import Clock from "./Clock";
import heroImage from "./hero.jpg";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
const HeroSection = () => {
	return (
		<div className="relative">
			<div className="h-screen min-h-[715px] w-full relative bg-primary">
				<div className="absolute inset-0 bg-foreground opacity-70"></div>
				<Image className="w-full h-full object-contain" src={heroImage} alt="Hero Image" />
			</div>

			<motion.div
				className="flex items-center justify-center absolute inset-0 z-10 text-background flex-col gap-8"
				layout
			>
				<motion.h2
					className="text-5xl"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
				>
					TRẬN CHUNG KẾT &quot;ĐẤT VÕ TRỜI VĂN&quot; MÙA 3
				</motion.h2>
				<motion.div
					className={cn("grid grid-cols-2 gap-8 max-w-[800px]")}
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, scale: 1 }}
				>
					{[
						{
							icon: <Calendar className="h-6 w-6 text-primary-foreground" />,
							title: "Thời Gian",
							desc: (
								<>
									Chủ nhật, 7 tháng 9, 2025 <br />
									18:00 - 22:00
								</>
							),
							iconRight: false,
						},
						{
							icon: <LocateIcon className="h-6 w-6 text-primary-foreground" />,
							title: "Địa điểm",
							desc: "Hội trường khách sạn Hải Âu Biên Cương",
							iconRight: true,
						},
					].map(({ icon, title, desc, iconRight }, i) => (
						<Card key={i}>
							<CardContent
								className={`flex gap-4 items-center${iconRight ? " text-right" : ""}`}
							>
								{!iconRight && (
									<div className="aspect-square w-10 bg-primary flex items-center justify-center rounded-full">
										{icon}
									</div>
								)}
								<div>
									<p className="text-lg md:text-xl font-semibold">{title}</p>
									<p>{desc}</p>
								</div>
								{iconRight && (
									<div className="aspect-square w-12 bg-primary flex items-center justify-center rounded-full">
										{icon}
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</motion.div>
				<motion.div
					className="flex flex-col gap-4 justify-center mt-10"
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
				>
					<Clock />
					<Button
						variant="secondary"
						className="uppercase font-bold rounded-none py-8 text-2xl hover:scale-120 transition-all hover:brightness-110"
						onClick={() => {
							window.scrollTo({
								top: document.getElementById("thi-sinh")?.offsetTop || 0,
								behavior: "smooth",
							});
						}}
					>
						<Fingerprint className="inline-block mr-2 h-10 w-10" />
						Đặt vé ngay
					</Button>
				</motion.div>
			</motion.div>
		</div>
	);
};
export default HeroSection;
