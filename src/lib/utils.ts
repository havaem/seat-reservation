import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function toShortId(id: string) {
  return id.substring(id.length - 4, id.length);
}
export function normalizeVN(str: string) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}
export function makeBankContent(orderId: string, buyerName: string) {
  const short = toShortId(orderId);
  const last = normalizeVN(buyerName.split(" ").slice(-1)[0])
    .replace(/\s/g, "")
    .slice(0, 12);
  return `ORD${short} ${last}`.slice(0, 30);
}
