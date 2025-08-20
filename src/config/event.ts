export const EVENT_TIER_CODE = {
  STANDARD: "STD",
  VIP: "VIP",
};

export const EVENT = {
  code: "DVTV3",
  startsAt: new Date("2025-09-07T11:00:00Z"),
  venueName: "KS Hải Âu Biên Cương",
  pricingTiers: [
    { code: EVENT_TIER_CODE.STANDARD, name: "Vé Thường", price: 35000 },
    { code: EVENT_TIER_CODE.VIP, name: "Vé VIP", price: 40000 },
  ],
};
