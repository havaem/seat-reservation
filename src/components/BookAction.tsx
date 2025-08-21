"use client";
import { useCheckout } from "@/hooks/useCheckout";
import useReady from "@/hooks/useReady";
import { cn } from "@/lib/utils";
import { renderClassNameColorSeat } from "@/utils/renderClassnameSeat";
import { useState } from "react";
import SeatItem from "./SeatItem";
import { Button } from "./ui/button";
import UserInputData from "./UserInputData";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/getErrorMessage";

const BookAction = () => {
  const { isLoading: isLoadingSeat, pricingTiers, seats, refetch } = useReady();
  const { isLoading, step, getRemainingMs, bank, startHold, placeOrder } =
    useCheckout();

  const [choosenSeats, setChoosenSeats] = useState<string[]>([]);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const handleChooseSeat = (seatId: string) => {
    const newChoosenSeats = choosenSeats.includes(seatId)
      ? choosenSeats.filter((id) => id !== seatId)
      : [...choosenSeats, seatId];
    setChoosenSeats(newChoosenSeats);
  };

  const handleHold = async () => {
    try {
      await startHold(choosenSeats);
      setIsOpenDialog(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error("Failed to hold seats:", e);
      toast.error(getErrorMessage(e?.code));
      refetch();
      setChoosenSeats([]);
    }
  };

  return (
    <div className="space-y-4">
      <UserInputData
        chooseSeats={choosenSeats}
        isLoading={isLoading}
        open={isOpenDialog}
        onOpenChange={setIsOpenDialog}
        placeOrder={placeOrder}
        step={step}
        bankInfo={bank}
        getRemainingMs={getRemainingMs}
      />
      <div className="flex justify-between gap-4 max-md:flex-col">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-8 rounded-md",
                renderClassNameColorSeat("available"),
              )}
            ></div>
            Trống
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-8 rounded-md",
                renderClassNameColorSeat("held"),
              )}
            ></div>
            Đang giữ chỗ
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-8 rounded-md",
                renderClassNameColorSeat("reserved"),
              )}
            ></div>
            Đã được đặt
          </div>
        </div>
        <div className="flex items-center gap-4">
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
      </div>
      {isLoadingSeat && (
        <>
          <p>Đang tải thông tin ghế...</p>
        </>
      )}
      <div className="overflow-auto">
        <div className="mx-auto grid max-w-3xl min-w-2xl grid-cols-2 gap-8 max-md:overflow-auto">
          <div className="grid grid-cols-5 gap-4">
            {seats.left.map((seat) => (
              <SeatItem
                key={seat.seatId}
                data={seat}
                onChooseSeat={handleChooseSeat}
                choosenSeats={choosenSeats}
              />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-4">
            {seats.right.map((seat) => (
              <SeatItem
                key={seat.seatId}
                data={seat}
                onChooseSeat={handleChooseSeat}
                choosenSeats={choosenSeats}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        {choosenSeats.length === 0 && (
          <p className="text-sm">Vui lòng chọn ghế để đặt vé</p>
        )}
        <Button
          className="w-full"
          disabled={choosenSeats.length === 0}
          loading={isLoading}
          onClick={handleHold}
        >
          Đặt vé
        </Button>
      </div>
    </div>
  );
};
export default BookAction;
