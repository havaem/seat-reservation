"use client";

import { useState, useEffect } from "react";

export function useTrafficQueue() {
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [isInQueue, setIsInQueue] = useState(false);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number>(0);

  useEffect(() => {
    // Check if user should be queued
    const checkQueue = async () => {
      try {
        const response = await fetch("/api/queue/status");
        if (response.status === 429) {
          // User is in queue
          const data = await response.json();
          setQueuePosition(data.position);
          setIsInQueue(true);
          setEstimatedWaitTime(data.estimatedWaitTime);
        } else {
          setIsInQueue(false);
          setQueuePosition(null);
        }
      } catch (error) {
        console.error("Queue check error:", error);
      }
    };

    checkQueue();

    // Check queue status every 5 seconds if in queue
    const interval = isInQueue ? setInterval(checkQueue, 5000) : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInQueue]);

  return {
    queuePosition,
    isInQueue,
    estimatedWaitTime,
  };
}
