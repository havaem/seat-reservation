import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2025-09-07T06:00:00Z").getTime();

const getFormattedTime = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(secs).padStart(2, "0"),
  };
};

const Clock = () => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = Date.now();
    return Math.max(0, Math.floor((EVENT_DATE - now) / 1000));
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { days, hours, minutes, seconds } = getFormattedTime(timeLeft);

  const timeUnits = [
    { value: days, label: "Ngày" },
    { value: hours, label: "Giờ" },
    { value: minutes, label: "Phút" },
    { value: seconds, label: "Giây" },
  ];

  return (
    <div className="text-primary-foreground flex items-center justify-center gap-4 text-2xl font-bold">
      {timeUnits.map(({ value, label }) => (
        <div
          key={label}
          className="bg-secondary text-foreground flex size-20 flex-col items-center justify-center max-md:size-20"
        >
          {value}
          <span className="text-xs uppercase">{label}</span>
        </div>
      ))}
    </div>
  );
};
export default Clock;
