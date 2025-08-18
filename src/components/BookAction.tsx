"use client";
import { EVENT } from "@/config/event";
import { cn } from "@/lib/utils";
import { SeatDoc } from "@/models/Seat";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCheckout } from "@/hooks/useCheckout";
import { code, em } from "motion/react-client";

const BookAction = () => {
  const {
    step,
    error,
    remainingMs,
    bank,
    startHold,
    placeOrder,
    refreshInstructions,
  } = useCheckout();

  const [pricingTiers, setPricingTiers] = useState<typeof EVENT.pricingTiers>(
    [],
  );
  const [seats, setSeats] = useState<SeatDoc[]>([]);
  const [choosenSeats, setChoosenSeats] = useState<string[]>([]);
  const fetchSeatData = async () => {
    const response = await fetch("/api/seatmap");
    const data = await response.json();
    setPricingTiers(data.pricingTiers);
    setSeats(data.seats);
  };

  const renderClassNameColorSeat = (status: string) => {
    let className = "";
    switch (status) {
      case "available":
        className = "bg-white";
        break;
      case "held":
        className = "bg-purple-200";
        break;
      case "reserved":
        className = "bg-gray-600";
        break;
      default:
        break;
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
    fetchSeatData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-4">
        {pricingTiers.map((tier) => (
          <div
            key={tier.code}
            className={cn(
              "flex items-center gap-2 rounded-md p-2",
              tier.code === "VIP"
                ? "bg-secondary text-secondary-foreground"
                : "bg-white",
            )}
          >
            <div>
              <span className="mr-2">{tier.name}</span>
              <span className="text-sm font-bold">{tier.price} đ</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-10 gap-4">
        {seats.map((seat) => (
          <button
            key={seat.seatId}
            className={cn(
              "col-span-1 flex items-center justify-center rounded-md border-2 border-transparent px-1 py-2 text-xs font-bold",
              renderClassNameColorSeat(seat.status),
              choosenSeats.includes(seat.seatId) && "border-primary",
            )}
            onClick={() => handleChooseSeat(seat.seatId)}
            disabled={seat.status !== "available"}
          >
            {seat.seatId}
          </button>
        ))}
      </div>
      <div>
        {choosenSeats.length === 0 && (
          <p className="text-sm">Vui lòng chọn ghế để đặt vé</p>
        )}
        <Button className="w-full" disabled={choosenSeats.length === 0}>
          Đặt vé
        </Button>
      </div>
    </div>
  );
};
export default BookAction;
