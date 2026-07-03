"use client";
import { Trans, useLingui } from "@lingui/react";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface Pulsante {
  icona: string;
  nome: string;
  funzione: (...args: any[]) => any;
  title: string;
  visibility?: boolean;
  disableButton?: boolean;
  configDialogPulsante: configDialogPulsante;
}

export interface configDialogPulsante {
  showDialog: boolean;
  message: string | (() => string);
}

const fabBaseClass =
  "flex size-10 min-w-10 cursor-pointer items-center justify-center rounded-full border p-0 transition-[transform,box-shadow] duration-200 scale-105 -rotate-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-35 [&_i]:text-[18px] [&_i]:text-[var(--color-text-bright)]";

const fabRedClass = cn(
  fabBaseClass,
  "border-[#dc2626] bg-[linear-gradient(180deg,#9f1239_0%,#be123c_40%,#9f174d_72%,#4c0519_100%)] text-[var(--color-text-bright)] shadow-[0_0_0_1px_rgba(40,6,12,0.72),0_0_14px_rgba(220,38,38,0.36),inset_0_1px_0_rgba(252,140,140,0.12)]",
  "hover:-translate-y-px hover:bg-[linear-gradient(180deg,#be123c_0%,#dc2626_38%,#9f1239_74%,#6c1438_100%)] hover:shadow-[0_0_0_1px_rgba(252,120,120,0.28),0_0_20px_rgba(220,38,38,0.42),inset_0_1px_0_rgba(254,180,180,0.16)]",
  "disabled:bg-[linear-gradient(180deg,#450a0a_0%,#280506_100%)] disabled:border-[rgba(220,38,38,0.2)] disabled:shadow-none",
  "[&_i]:drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
);

const fabBlueClass = cn(
  fabBaseClass,
  "border-[#0284c7] bg-[linear-gradient(180deg,#075985_0%,#0369a1_40%,#0c4a6e_74%,#082f49_100%)] text-[var(--color-text-bright)] shadow-[0_0_0_1px_rgba(4,27,46,0.7),0_0_14px_rgba(2,132,199,0.38),inset_0_1px_0_rgba(100,180,240,0.12)]",
  "hover:-translate-y-px hover:bg-[linear-gradient(180deg,#0369a1_0%,#0284c7_38%,#0c4a6e_74%,#0a3d5c_100%)] hover:shadow-[0_0_0_1px_rgba(14,165,233,0.28),0_0_20px_rgba(2,132,199,0.42),inset_0_1px_0_rgba(120,190,255,0.16)]",
  "disabled:bg-[linear-gradient(180deg,#082f49_0%,#051f30_100%)] disabled:border-[rgba(2,132,199,0.2)] disabled:shadow-none",
  "[&_i]:drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
);

const Button = observer((props: { pulsanti: Pulsante[] }) => {
  const [isVertical, setIsVertical] = useState<boolean>(
    typeof window !== "undefined" ? window.innerHeight > window.innerWidth : false
  );
  const [open, setOpen] = useState(false);
  const [currentFunction, setCurrentFunction] = useState<(() => any) | null>(null);
  const [messageTitle, setMessageTitle] = useState<string>("");
  const { i18n } = useLingui();

  const handleClickOpen = (
    funzione: (...args: any[]) => any,
    configDialogPulsante: configDialogPulsante
  ) => {
    setCurrentFunction(() => funzione);
    const finalMessage =
      typeof configDialogPulsante.message === "function"
        ? configDialogPulsante.message()
        : configDialogPulsante.message;
    setMessageTitle(finalMessage);
    if (configDialogPulsante.showDialog) {
      setOpen(true);
    } else {
      funzione();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentFunction(null);
  };

  const handleConfirm = () => {
    if (currentFunction) currentFunction();
    setOpen(false);
    setCurrentFunction(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  void isVertical;

  return (
    <div className="flex gap-3 p-2">
      {props.pulsanti.map((button, index) => (
        <div key={index} className="col-button">
          <button
            type="button"
            id={`button-${index}`}
            className={button.nome === "red" ? fabRedClass : cn(fabBlueClass, "fab-blue-light")}
            title={button.title}
            onClick={() => handleClickOpen(button.funzione, button.configDialogPulsante)}
            disabled={button.disableButton}
            aria-label={button.title}
          >
            <i className={button.icona} />
          </button>
        </div>
      ))}

      <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
        <DialogContent
          showCloseButton={false}
          className="max-w-md overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] p-0 shadow-[var(--shadow-md)] sm:max-w-md"
        >
          <DialogHeader className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)] px-6 py-6 text-center">
            <DialogTitle className="m-0 text-center text-xl font-extrabold tracking-wide text-[var(--color-primary-hover)]">
              {i18n._("conferma_operazione")}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-6">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-info-soft-4)] bg-[var(--color-info-soft-2)] p-5 shadow-[var(--shadow-sm)]">
              <DialogDescription className="text-left text-base font-medium leading-normal text-[var(--color-text-muted)]">
                {messageTitle || "Sei sicuro di voler procedere con questa operazione?"}
              </DialogDescription>
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-3 border-t-0 bg-transparent px-6 pb-6">
            <ShadcnButton
              variant="ghost"
              onClick={handleClose}
              className="rounded-[var(--radius-lg)] px-6 py-2.5 font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)]"
            >
              <Trans id="annulla" />
            </ShadcnButton>
            <ShadcnButton
              onClick={handleConfirm}
              className="rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-8 py-2.5 font-semibold text-[var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-all hover:-translate-y-px hover:bg-[var(--color-primary)] hover:shadow-[var(--shadow-md)]"
            >
              <Trans id="si_conferma" />
            </ShadcnButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default Button;
