import { Schema, model, models } from "mongoose";

export interface HoldDoc {
    _id: string;
    seatIds: string[];
    total: number;
    expiresAt: Date;
}

const HoldSchema = new Schema<HoldDoc>({
    _id: { type: String, required: true },
    seatIds: [{ type: String, required: true }],
    total: { type: Number, required: true },
    expiresAt: { type: Date, index: true, required: true },
});

HoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Hold = models.Hold || model<HoldDoc>("Hold", HoldSchema);