"use client";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/useCheckout";
import { cn } from "@/lib/utils";
import { SeatDoc } from "@/models/Seat";
import { useEffect, useState } from "react";

const Page = () => {
  const {
    step,
    error,
    remainingMs,
    bank,
    startHold,
    placeOrder,
    refreshInstructions,
  } = useCheckout();

  const [seats, setSeats] = useState<SeatDoc[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const fetchData = async () => {
    const response = await fetch("/api/seatmap");
    const data = await response.json();
    setSeats(data.seats);
  };

  const renderClassNameColorSeat = (
    tier: SeatDoc["tierCode"],
    status: SeatDoc["status"],
  ) => {
    let className = "";
    switch (tier) {
      case "VIP":
        className = "bg-accent";
        break;
      case "STD":
        className = "bg-secondary";
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

  const [choosenSeats, setChoosenSeats] = useState<string[]>([]);

  const handleChooseSeat = (seatId: string) => {
    const newChoosenSeats = choosenSeats.includes(seatId)
      ? choosenSeats.filter((id) => id !== seatId)
      : [...choosenSeats, seatId];
    setChoosenSeats(newChoosenSeats);
  };

  const handleBooking = async () => {
    await startHold(choosenSeats);
  };

  const handleSubmitInformation = async () => {
    await placeOrder({ fullName: "Nguyễn Văn A", phone: "0354714955" });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (remainingMs !== 0) {
      if (remainingTime === 0) setRemainingTime(remainingMs / 1000);
      const interval = setInterval(() => {
        setRemainingTime((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [remainingMs]);

  return (
    <div className="container mx-auto space-y-4 px-4 py-2">
      <h2>Example booking seat</h2>
      {error && <p className="text-red-600">{error}</p>}
      {step === "select" && (
        <>
          <div className="grid grid-cols-12 gap-4">
            {seats.map((seat) => (
              <button
                key={seat.seatId}
                className={cn(
                  "col-span-1 flex items-center justify-center rounded-md border-2 border-transparent px-2 py-3",
                  renderClassNameColorSeat(seat.tierCode, seat.status),
                  choosenSeats.includes(seat.seatId) && "border-primary",
                )}
                onClick={() => handleChooseSeat(seat.seatId)}
              >
                {seat.seatId}
              </button>
            ))}
          </div>
          <div>
            <Button onClick={handleBooking}>Booking</Button>
          </div>
        </>
      )}
      {step === "holding" && <p>Đang giữ chỗ…</p>}
      {step === "pay" && (
        <div className="space-y-3">
          <h3 className="font-semibold">Thông tin người mua</h3>
          {/* Form người mua – ở đây demo nhanh */}
          <button onClick={handleSubmitInformation} className="btn">
            Tạo đơn & Hiện hướng dẫn chuyển khoản
          </button>
        </div>
      )}
      {step === "done" && bank && (
        <div className="space-y-2">
          <h3 className="font-semibold">
            Chuyển khoản trong:{" "}
            {`${Math.floor(remainingTime / 3600)}:${String(Math.floor((remainingTime % 3600) / 60)).padStart(2, "0")}:${String(remainingTime % 60).padStart(2, "0")}`}
          </h3>
          <ul className="text-sm">
            <li>
              Ngân hàng: <b>{bank.bank}</b>
            </li>
            <li>
              Số tài khoản: <b>{bank.accountNumber}</b> (CTK: {bank.accountName}
              )
            </li>
            <li>
              Nội dung: <code>{bank.content}</code>
            </li>
            <li>
              Số tiền: <b>{bank.amount.toLocaleString()}đ</b>
            </li>
          </ul>
          <button onClick={refreshInstructions} className="btn">
            Làm mới hướng dẫn
          </button>
          <p className="text-xs text-gray-500">
            * Nếu quá thời gian, đơn sẽ tự hủy. Bạn có thể đặt lại.
          </p>
        </div>
      )}
    </div>
  );
};
export default Page;
