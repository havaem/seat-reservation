    import { Schema, model, models } from "mongoose";

    export interface SeatDoc {
        _id?: string;
        seatId: string;
        tierCode: "STD" | "VIP" | string;
        status: "available" | "held" | "reserved";
        holdId?: string | null;
        orderId?: string | null;
    }

    const SeatSchema = new Schema<SeatDoc>({
        _id: { type: String, required: true },
        seatId: { type: String, unique: true, index: true, required: true },
        tierCode: { type: String, index: true, required: true },
        status: {
            type: String,
            enum: ["available", "held", "reserved"],
            default: "available",
            index: true,
            required: true,
        },
        holdId: { type: String, default: null },
        orderId: { type: String, default: null },
    });

    export const Seat = models.Seat || model<SeatDoc>("Seat", SeatSchema);