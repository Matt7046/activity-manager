"use client";
import { Trans, useLingui } from "@lingui/react";
import type { SelectChangeEvent } from "@/types/form-events";
import { ChevronDown } from "lucide-react";
import React, { useId } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./DialogEmail.css";

interface EmailDialogProps {
  openD: boolean;
  handleCloseD: () => void;
  emailOptions: string[];
  handleEmailChange: (event: SelectChangeEvent) => void;
  handleConfirm: (simulated: number) => void;
  email: string;
  simulated: number;
}

const DialogEmail: React.FC<EmailDialogProps> = ({
  openD,
  handleCloseD,
  emailOptions,
  handleEmailChange,
  handleConfirm,
  email,
  simulated,
}) => {
  const { i18n } = useLingui();
  const selectId = useId();

  const onEmailChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleEmailChange({ target: { value: event.target.value } });
  };

  return (
    <Dialog open={openD} onOpenChange={(open) => !open && handleCloseD()}>
      <DialogContent
        showCloseButton={false}
        className="dialog-email-content max-w-lg overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] p-0 shadow-[var(--shadow-md)] sm:max-w-lg"
      >
        <DialogHeader className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)] px-6 py-5 text-center">
          <DialogTitle className="m-0 text-center text-lg font-extrabold uppercase tracking-wide text-[var(--color-primary-hover)]">
            <Trans id="configurazione_tutorato" />
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-info-soft-4)] bg-[var(--color-info-soft-2)] p-5 shadow-[var(--shadow-sm)]">
            <div className="mb-5 rounded-[var(--radius-sm)] border-l-4 border-[var(--color-primary)] bg-[var(--color-primary-soft)] px-4 py-3">
              <p className="text-sm font-medium text-[var(--color-primary-hover)]">
                <Trans id="seleziona_lindirizzo_email_del_tutorato_per_procedere_con_lassegnazione" />
              </p>
            </div>

            <label htmlFor={selectId} className="ml-1 text-sm font-semibold text-[var(--color-muted-500)]">
              <Trans id="indirizzo_email" />
            </label>
            <div className="dialog-email-select-wrap">
              <select
                id={selectId}
                className="dialog-email-select"
                value={email}
                onChange={onEmailChange}
                autoComplete="email"
              >
                <option value="" disabled>
                  {i18n._("indirizzo_email")}
                </option>
                {emailOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="dialog-email-select-icon" aria-hidden />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 border-t-0 bg-transparent px-6 pb-6">
          <Button
            variant="ghost"
            onClick={handleCloseD}
            className="rounded-[var(--radius-lg)] font-semibold text-[var(--color-danger)]"
          >
            <Trans id="annulla" />
          </Button>
          <Button
            onClick={() => handleConfirm(simulated)}
            disabled={!email}
            className="rounded-[var(--radius-lg)] bg-[var(--color-primary)] px-7 py-2.5 font-semibold text-[var(--color-on-primary)] transition-all hover:-translate-y-px hover:shadow-[var(--shadow-sm)] disabled:opacity-50"
          >
            <Trans id="conferma_scelta" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEmail;
