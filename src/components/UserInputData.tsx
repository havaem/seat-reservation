"use client";
import { EVENT_TIER_CODE } from "@/config/event";
import { TBankInfo, TCheckoutStep } from "@/hooks/useCheckout";
import { OrderItem } from "@/models/Order";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentProps, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import OrderItemAction from "./OrderItemAction";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      error: "Họ và tên phải có ít nhất 2 ký tự.",
    })
    .max(70, {
      error: "Họ và tên không được vượt quá 70 ký tự.",
    }),
  email: z.string().email({
    error: "Email không hợp lệ.",
  }),
  phone: z
    .string()
    .regex(/^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/, {
      message:
        "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam.",
    }),
});

type Props = ComponentProps<typeof Dialog> & {
  chooseSeats: string[];
  placeOrder: (
    values: z.infer<typeof formSchema>,
    order: OrderItem[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;
  step: TCheckoutStep;
  bankInfo: TBankInfo | null;
  getRemainingMs: () => number;
  isLoading: boolean;
};
const UserInputData: React.FC<Props> = ({
  chooseSeats,
  placeOrder,
  step,
  bankInfo,
  getRemainingMs,
  isLoading,
  onOpenChange,
  ...props
}) => {
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await placeOrder(values, order);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(getErrorMessage(error?.code));
      console.log(error);
      onOpenChange?.(false);
    }
  }

  function handlePaid() {
    toast.success(
      "Chúng tôi sẽ xác nhận thanh toán và sẽ tiến hành gửi thông tin đặt vé đến email của bạn.",
    );
    onOpenChange?.(false);
  }

  const handleTierChange = (seatId: string, newTierCode: string) => {
    setOrder((prev) =>
      prev.map((item) =>
        item.seatId === seatId ? { ...item, tierCode: newTierCode } : item,
      ),
    );
  };

  useEffect(() => {
    if (step === "done") {
      const timeInSeconds = Math.max(0, Math.floor(getRemainingMs() / 1000));
      console.log("Setting remaining time for done step:", {
        remainingMs: getRemainingMs(),
        timeInSeconds,
      });
      setRemainingTime(timeInSeconds);
    }
  }, [step, getRemainingMs]);

  useEffect(() => {
    if (step === "done" && remainingTime > 0) {
      const interval = setInterval(() => {
        // Cập nhật từ getRemainingMs để đảm bảo độ chính xác
        const currentMs = getRemainingMs();
        const currentSeconds = Math.max(0, Math.floor(currentMs / 1000));
        setRemainingTime(currentSeconds);

        // Nếu hết thời gian thì dừng interval
        if (currentSeconds <= 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, remainingTime, getRemainingMs]);

  useEffect(() => {
    const newOrder: OrderItem[] = chooseSeats.map((e) => ({
      seatId: e,
      tierCode: EVENT_TIER_CODE.STANDARD,
    }));
    setOrder(newOrder);
  }, [chooseSeats]);

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        {step === "pay" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <DialogHeader>
                <DialogTitle>Thông tin của bạn</DialogTitle>
                <DialogDescription>
                  Cung cấp thông tin để chúng tôi có thể liên hệ bạn.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <Label htmlFor="seats">Chỗ ngồi đã giữ</Label>
                <div className="max-h-52 space-y-2 overflow-y-auto">
                  {order.map((item) => (
                    <OrderItemAction
                      key={item.seatId}
                      data={item}
                      onTierChange={handleTierChange}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nguyễn Văn A"
                            {...field}
                            className="placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="nguyenvana@example.com"
                            className="placeholder:text-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0123456789"
                            {...field}
                            className="placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Hủy</Button>
                </DialogClose>
                <Button type="submit" loading={isLoading}>
                  Xác nhận
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
        {step === "done" && bankInfo && (
          <>
            <DialogHeader>
              <DialogTitle>Thông tin thanh toán</DialogTitle>
              <DialogDescription>
                Vui lòng thanh toán để hoàn tất đặt chỗ.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <p className="font-semibold">
                Chuyển khoản trong:{" "}
                {(() => {
                  const hours = Math.floor(remainingTime / 3600);
                  const minutes = Math.floor((remainingTime % 3600) / 60);
                  const seconds = Math.floor(remainingTime % 60);
                  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                })()}
              </p>
              <ul className="text-sm">
                <li>
                  Ngân hàng: <b>{bankInfo.bank}</b>
                </li>
                <li>
                  Số tài khoản: <b>{bankInfo.accountNumber}</b>
                </li>
                <li>
                  Chủ tài khoản: <b>{bankInfo.accountName}</b>
                </li>
                <li>
                  Nội dung:{" "}
                  <code className="bg-amber-100 text-xl">
                    {bankInfo.content}
                  </code>
                  <Button
                    type="button"
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                      navigator.clipboard.writeText(bankInfo.content);
                      toast.success("Đã sao chép nội dung!");
                    }}
                  >
                    Sao chép
                  </Button>
                </li>
                <li>
                  Số tiền:{" "}
                  <b className="bg-amber-100 text-lg">
                    {bankInfo.amount.toLocaleString()}đ
                  </b>
                </li>
              </ul>
              <p className="text-xs text-gray-500">
                * Nếu quá thời gian, đơn sẽ tự hủy. Bạn có thể đặt lại.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button loading={isLoading} onClick={handlePaid}>
                Đã thanh toán
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default UserInputData;
