"use client";

import { useEffect } from "react";

export function PWAInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.error("Error registrando service worker", err));
  }, []);

  return null;
}

