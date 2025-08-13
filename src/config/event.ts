export const EVENT = {
  code: "DVTV3",
  name: 'Chung kết "Đất Võ Trời Văn" mùa 3',
  startsAt: new Date("2025-09-07T11:00:00Z"), 
  venueName: "KS Hải Âu Biên Cương",
  pricingTiers: [
    { code: "STD", name: "Vé Thường", price: 35000, color: "#DDD" },
    { code: "VIP", name: "Vé VIP",     price: 45000, color: "#EAB308" },
  ],
} as const;