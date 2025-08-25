const ERROR_MESSAGES: Record<string, string> = {
  SEAT_ALREADY_HELD: "Ghế đã được giữ chỗ",
  HOLD_NOT_FOUND: "Không tìm thấy yêu cầu giữ chỗ",
  HOLD_EXPIRED: "Yêu cầu giữ chỗ đã hết hạn",
  BOOKING_DISABLED: "Tính năng đặt vé hiện đang tạm ngưng",
  EXCEED_MAX_SEATS: "Vượt quá số ghế tối đa cho phép mỗi đơn",
  RATE_LIMITED: "Quá nhiều yêu cầu, vui lòng thử lại sau",
  QUEUED: "Vui lòng chờ trong hàng đợi",
};
export const getErrorMessage = (error = ""): string => {
  return ERROR_MESSAGES[error] || "Đã xảy ra lỗi. Vui lòng thử lại.";
};
