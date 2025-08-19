import { EVENT } from "@/config/event";
import { SeatDoc } from "@/models/Seat";
import { useEffect, useState } from "react";

function splitLeftRight(arr: SeatDoc[], groupSize = 10) {
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length; i += groupSize) {
    const group = arr.slice(i, i + groupSize); // mỗi loại (A, B, C…)
    left.push(...group.slice(0, 5));
    right.push(...group.slice(-5));
  }

  return { left, right };
}

const useReady = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pricingTiers, setPricingTiers] = useState<typeof EVENT.pricingTiers>(
    [],
  );
  const [seats, setSeats] = useState<{
    left: SeatDoc[];
    right: SeatDoc[];
  }>({
    left: [],
    right: [],
  });
  const fetchSeatData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/seatmap");
      const data = await response.json();
      setPricingTiers(data.pricingTiers);
      setSeats(splitLeftRight(data.seats));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatData();
  }, []);

  return {
    pricingTiers,
    seats,
    isLoading,
    refetch: fetchSeatData
  };
};
export default useReady;
