// Script để advance queue - có thể chạy như cron job
export async function advanceQueue() {
  try {
    const response = await fetch("/api/queue/status", {
      method: "POST",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(
        `Queue advanced. Currently serving: ${data.currentServing}, Queue size: ${data.queueSize}`,
      );
    }
  } catch (error) {
    console.error("Failed to advance queue:", error);
  }
}

// Auto-advance mỗi 30 giây
if (typeof window === "undefined") {
  // Chỉ chạy trên server
  setInterval(advanceQueue, 30000);
}
