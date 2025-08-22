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
      className = "bg-gray-500 text-white opacity-80";
      break;
    default:
      break;
  }
  return className;
};
