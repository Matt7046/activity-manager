"use client";

import { useEffect } from "react";

export const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // Trigger update check all'avvio per rendere più veloce il refresh dello SW.
        reg.update().catch(() => {});
      })
      .catch(() => {});
  }, []);

  return null;
};