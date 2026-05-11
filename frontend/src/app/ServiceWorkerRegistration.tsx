"use client";

import { useEffect } from "react";

type SWRegistrationExtras = ServiceWorkerRegistration & {
  sync?: { register: (tag: string) => Promise<void> };
  periodicSync?: { register: (tag: string, options: { minInterval: number }) => Promise<void> };
};

const registerBackgroundFeatures = (reg: ServiceWorkerRegistration) => {
  const r = reg as SWRegistrationExtras;
  void r.sync?.register("activity-manager-background-sync").catch(() => {});
  void r.periodicSync
    ?.register("activity-manager-periodic", { minInterval: 86_400_000 })
    .catch(() => {});
};

export const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // Trigger update check all'avvio per rendere più veloce il refresh dello SW.
        reg.update().catch(() => {});
        registerBackgroundFeatures(reg);
      })
      .catch(() => {});
  }, []);

  return null;
};