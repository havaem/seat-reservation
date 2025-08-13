import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toShortId(id: string) {
  return Buffer.from(id).toString("base64").replace(/[^A-Z0-9]/gi, "").slice(0, 8);
}
export function normalizeVN(str: string) {
  return str
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}
export function makeBankContent(eventCode: string, orderId: string, buyerName: string) {
  const short = toShortId(orderId);
  const last = normalizeVN(buyerName.split(" ").slice(-1)[0]).replace(/\s/g, "").slice(0, 12);
  return `${eventCode} ORD${short} ${last}`.slice(0, 30);
}
export function suggestionFrom(orderId: string, amount: number) {
  const hash = [...orderId].reduce((a, c) => (a * 33 + c.charCodeAt(0)) % 97, 17);
  const k = (hash % 50) + 1; // +1..50
  return amount + k;
}
