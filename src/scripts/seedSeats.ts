import mongoose from "mongoose";
import { Seat, SeatDoc } from "@/models/Seat";

const MONGODB_URI =
  "mongodb+srv://admin:admin@cluster0.ir3x38i.mongodb.net/booking-reservation";

(async () => {
  await mongoose.connect(MONGODB_URI);
  const seats: SeatDoc[] = [];
  for (let r = 0; r < 9; r++) {
    const row = String.fromCharCode(65 + r);
    for (let c = 1; c <= 10; c++) {
      const id = `${row}-${String(c).padStart(2, "0")}`;
      seats.push({ seatId: id, status: "available" });
    }
  }
  await Seat.deleteMany({});
  await Seat.insertMany(seats);
  console.log("Seeded seats:", seats.length);
  await mongoose.disconnect();
})();
