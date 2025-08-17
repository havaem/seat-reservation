"use client";
import { EVENT } from "@/config/event";
import { cn } from "@/lib/utils";
import { SeatDoc } from "@/models/Seat";
import { useEffect, useState } from "react";

const BookAction = () => {
  const [pricingTiers, setPricingTiers] = useState<typeof EVENT.pricingTiers>(
    [],
  );
  const [seats, setSeats] = useState<SeatDoc[]>([]);
  const [choosenSeats, setChoosenSeats] = useState<string[]>([]);

  const fetchData = async () => {
    const response = await fetch("/api/seatmap");
    const data = await response.json();
    setPricingTiers(data.pricingTiers);
    setSeats(data.seats);
  };

  const renderClassNameColorSeat = (tier: string, status: string) => {
    let className = "";
    switch (tier) {
      case "VIP":
        className = "bg-accent text-accent-foreground";
        break;
      case "STD":
        className = "bg-secondary text-secondary-foreground";
      default:
        break;
    }
    if (status === "held") {
      className = "bg-purple-200";
    }
    if (status === "reserved") {
      className = "bg-gray-600";
    }
    return className;
  };

  const handleChooseSeat = (seatId: string) => {
    const newChoosenSeats = choosenSeats.includes(seatId)
      ? choosenSeats.filter((id) => id !== seatId)
      : [...choosenSeats, seatId];
    setChoosenSeats(newChoosenSeats);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-4">
        {pricingTiers.map((tier) => (
          <div
            key={tier.code}
            className="flex items-center gap-2 rounded-md bg-white p-2"
          >
            <div
              className={cn(
                "size-6 rounded-md",
                renderClassNameColorSeat(tier.code, "available"),
              )}
            ></div>
            <div>
              <span className="mr-2">{tier.name}</span>
              <span className="text-sm font-bold">{tier.price} đ</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {seats.map((seat) => (
          <button
            key={seat.seatId}
            className={cn(
              "col-span-1 flex items-center justify-center rounded-md border-2 border-transparent px-1 py-2 text-xs font-bold",
              renderClassNameColorSeat(seat.tierCode, seat.status),
              choosenSeats.includes(seat.seatId) && "border-primary",
            )}
            onClick={() => handleChooseSeat(seat.seatId)}
          >
            {seat.seatId}
          </button>
        ))}
      </div>
    </div>
  );
};
export default BookAction;
