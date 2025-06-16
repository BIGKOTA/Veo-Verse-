"use client";

import { useEffect } from "react";

export default function TempoInit() {
  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_TEMPO) {
        try {
          const { TempoDevtools } = await import("tempo-devtools");
          TempoDevtools.init();
        } catch (error) {
          console.warn("Failed to initialize TempoDevtools:", error);
        }
      }
    };

    init();
  }, []);

  return null;
}
