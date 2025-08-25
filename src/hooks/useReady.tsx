import { SeatDoc } from "@/models/Seat";
import { useSeatMap } from "@/hooks/useSeatMap";
import { useMemo } from "react";

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
  const {
    seatMap,
    seats: rawSeats,
    pricingTiers,
    loading,
    error,
    refetch,
  } = useSeatMap();

  // Memoize split seats to avoid recalculation
  const seats = useMemo(() => {
    return splitLeftRight(rawSeats);
  }, [rawSeats]);

  return {
    pricingTiers,
    seats,
    isLoading: loading,
    error,
    refetch,
    seatMap, // Include full seat map data for advanced usage
  };
};

export default useReady;
