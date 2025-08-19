import { cn } from "@/lib/utils";
import { SeatDoc } from "@/models/Seat";
import { renderClassNameColorSeat } from "@/utils/renderClassnameSeat";

interface Props {
  choosenSeats: string[];
  data: SeatDoc;
  onChooseSeat: (seatId: string) => void;
}
const SeatItem: React.FC<Props> = ({ data, onChooseSeat, choosenSeats }) => {
  return (
    <button
      className={cn(
        "col-span-1 flex items-center justify-center rounded-md border-2 border-transparent px-1 py-2 text-xs font-bold disabled:cursor-not-allowed",
        renderClassNameColorSeat(data.status),
        choosenSeats.includes(data.seatId) && "border-primary",
      )}
      onClick={() => onChooseSeat(data.seatId)}
      disabled={data.status !== "available"}
    >
      {data.seatId}
    </button>
  );
};

export default SeatItem;
