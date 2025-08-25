"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds
            gcTime: 5 * 60 * 1000, // 5 minutes (was cacheTime)
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors except 429 (rate limit)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const status = (error as any)?.status;
              if (status && status >= 400 && status < 500 && status !== 429) {
                return false;
              }
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: (failureCount, error) => {
              // Don't retry mutations on client errors
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const status = (error as any)?.status;
              if (status && status >= 400 && status < 500) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
