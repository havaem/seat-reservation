export const renderClassNameColorSeat = (status: string) => {
  let className = "";
  switch (status) {
    case "available":
      className = "bg-white";
      break;
    case "held":
      className = "bg-purple-200";
      break;
    case "reserved":
      className = "bg-gray-600";
      break;
    default:
      break;
  }
  return className;
};
