import { div } from "motion/react-client";
import { useEffect, useState } from "react";

const Clock = () => {
	const [timeLeft, setTimeLeft] = useState(0);

	useEffect(() => {
		const eventTime = new Date("2025-09-07T06:00:00Z").getTime();
		const now = new Date().getTime();
		setTimeLeft(Math.max(0, Math.floor((eventTime - now) / 1000)));
	}, []);
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => Math.max(0, prev - 1));
		}, 1000);
		return () => clearInterval(timer);
	}, []);
	const getFormattedTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return {
			hours: String(hours).padStart(2, "0"),
			minutes: String(minutes).padStart(2, "0"),
			seconds: String(secs).padStart(2, "0"),
		};
	};
	return (
		<div className="flex items-center justify-center gap-4 text-2xl font-bold text-primary-foreground">
			<div className="w-24 h-24 bg-secondary text-foreground flex items-center justify-center flex-col">
				{getFormattedTime(timeLeft).hours}
				<span className="text-sm uppercase">Giờ</span>
			</div>
			<div className="w-24 h-24 bg-secondary text-foreground flex items-center justify-center flex-col">
				{getFormattedTime(timeLeft).minutes}
				<span className="text-sm uppercase">Phút</span>
			</div>
			<div className="w-24 h-24 bg-secondary text-foreground flex items-center justify-center flex-col">
				{getFormattedTime(timeLeft).seconds}
				<span className="text-sm uppercase">Giây</span>
			</div>
		</div>
	);
};
export default Clock;
