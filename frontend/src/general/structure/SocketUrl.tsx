"use client";

/**
 * URL WebSocket notifiche (stesso host della pagina: nginx espone di solito `/ws/notifications` lì).
 * Su https usa `wss://`.
 *
 * Opzionale: `NEXT_PUBLIC_WS_NOTIFICATION_BASE` = origine senza slash finale, es.
 * `wss://activity-manager.colorsdev.tech` se il WS non è sullo stesso host della pagina.
 */
export const notificationWebSocketUrl = (emailUserCurrent: string | undefined): string => {
  const q = encodeURIComponent(emailUserCurrent ?? "");
  const custom = process.env.NEXT_PUBLIC_WS_NOTIFICATION_BASE?.trim().replace(/\/$/, "");
  if (custom) {
    return `${custom}/ws/notifications?emailUserCurrent=${q}`;
  }
  if (typeof window !== "undefined") {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${window.location.host}/ws/notifications?emailUserCurrent=${q}`;
  }
  return `ws://127.0.0.1/ws/notifications?emailUserCurrent=${q}`;
};
