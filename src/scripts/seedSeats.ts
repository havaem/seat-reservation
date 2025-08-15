import mongoose from "mongoose";
import { Seat, SeatDoc } from "@/models/Seat";

const MONGODB_URI =
  "mongodb+srv://admin:admin@cluster0.ir3x38i.mongodb.net/booking-reservation";

(async () => {
  await mongoose.connect(MONGODB_URI);
  const seats: SeatDoc[] = [];
  for (let r = 0; r < 12; r++) {
    const row = String.fromCharCode(65 + r);
    for (let c = 1; c <= 12; c++) {
      const id = `${row}-${String(c).padStart(2, "0")}`;
      const tier = r < 3 ? "VIP" : "STD";
      seats.push({ seatId: id, tierCode: tier, status: "available" });
    }
  }
  await Seat.deleteMany({});
  await Seat.insertMany(seats);
  console.log("Seeded seats:", seats.length);
  await mongoose.disconnect();
})();
