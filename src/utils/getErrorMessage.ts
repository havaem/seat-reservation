const ERROR_MESSAGES: Record<string, string> = {
  SEAT_ALREADY_HELD: "Ghế đã được giữ chỗ",
  HOLD_NOT_FOUND: "Không tìm thấy yêu cầu giữ chỗ",
  HOLD_EXPIRED: "Yêu cầu giữ chỗ đã hết hạn",
};
export const getErrorMessage = (error = ""): string => {
  return ERROR_MESSAGES[error] || "Đã xảy ra lỗi. Vui lòng thử lại.";
};
