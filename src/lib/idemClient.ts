export const idemp = {
  get(name: string) {
    if (typeof window === "undefined") return crypto.randomUUID();
    const k = sessionStorage.getItem(name) || crypto.randomUUID();
    sessionStorage.setItem(name, k);
    return k;
  },
  clear(name: string) {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(name);
  },
};
