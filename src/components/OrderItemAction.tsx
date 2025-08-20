import { EVENT } from "@/config/event";
import { OrderItem } from "@/models/Order";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

interface Props {
  data: OrderItem;
  onTierChange?: (seatId: string, newTierCode: string) => void;
}

const OrderItemAction: React.FC<Props> = ({ data, onTierChange }) => {
  const selectedTier = EVENT.pricingTiers.find(
    (tier) => tier.code === data.tierCode,
  );

  const handleTierChange = (newTierCode: string) => {
    if (onTierChange) {
      onTierChange(data.seatId, newTierCode);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <span className="font-medium">Ghế {data.seatId}</span>
      </div>

      <div className="flex items-center gap-2">
        <Select value={data.tierCode} onValueChange={handleTierChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Chọn loại vé" />
          </SelectTrigger>
          <SelectContent>
            {EVENT.pricingTiers.map((tier) => (
              <SelectItem key={tier.code} value={tier.code}>
                <div className="flex flex-col">
                  <span>{tier.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {tier.price.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-right">
          <div className="font-medium">
            {selectedTier?.price.toLocaleString("vi-VN")}đ
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderItemAction;
