"use client";
import { Trans } from "@lingui/react";
import React from "react";
import { Separator } from "@/components/ui/separator";
import Button, { Pulsante } from "../ms-button/Button";

export interface PopoverNotification {
  message: string | undefined;
  subText: string[];
}

interface PopoverComponentProps {
  notifications: PopoverNotification[];
  openAnchor: boolean;
  anchorEl?: HTMLElement | null;
  handleCloseAnchor: () => void;
  pulsanteNotification: Pulsante;
  children?: React.ReactNode;
}

const PopoverComponent: React.FC<PopoverComponentProps> = ({
  notifications,
  openAnchor,
  anchorEl,
  handleCloseAnchor,
  pulsanteNotification,
}) => {
  void anchorEl;

  if (!openAnchor) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close notifications"
        className="fixed inset-0 z-40 bg-transparent"
        onClick={handleCloseAnchor}
      />
      <div
        id="popover-notifications"
        className="fixed right-6 bottom-6 z-50 min-w-[min(300px,92vw)] max-w-[min(380px,92vw)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-md)] max-sm:left-6 max-sm:right-6 max-sm:bottom-4 max-sm:min-w-0 max-sm:max-w-none"
      >
        <div className="bg-[var(--color-surface)]">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index}>
                <p className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-4 text-sm font-extrabold tracking-wide text-[var(--color-primary-hover)] uppercase">
                  {notification.message || "Notifiche"}
                </p>

                {notification.subText.slice(0, 5).map((subTextOne, subIndex) => (
                  <React.Fragment key={subIndex}>
                    <p className="block cursor-pointer px-4 py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-primary-soft-hover)] hover:text-[var(--color-primary-hover)]">
                      {subTextOne}
                    </p>
                    {subIndex < notification.subText.length - 1 && (
                      <Separator className="bg-[var(--color-border)]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            ))
          ) : (
            <div className="flex justify-end px-4 py-3">
              <p className="text-right text-sm text-[var(--color-muted-300)]">
                <Trans id="nessuna_nuova_notifica" />
              </p>
            </div>
          )}

          <div className="flex w-full justify-end border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
            <Button pulsanti={[pulsanteNotification]} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PopoverComponent;
