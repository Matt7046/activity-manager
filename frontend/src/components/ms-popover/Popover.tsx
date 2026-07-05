"use client";
import { Trans } from "@lingui/react";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import Button, { Pulsante } from "../ms-button/Button";

export interface PopoverNotification {
  message: string | undefined;
  subText: string[];
}

interface PopoverComponentProps {
  notifications: PopoverNotification[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  pulsanteNotification: Pulsante;
}

const PopoverComponent: React.FC<PopoverComponentProps> = ({
  notifications,
  open,
  onOpenChange,
  trigger,
  pulsanteNotification,
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={<span className="inline-flex">{trigger}</span>} />
      <PopoverContent
        id="popover-notifications"
        side="bottom"
        align="end"
        sideOffset={8}
        className="w-[min(380px,92vw)] max-w-[380px] overflow-hidden p-0"
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
      </PopoverContent>
    </Popover>
  );
};

export default PopoverComponent;
