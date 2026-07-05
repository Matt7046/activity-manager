"use client";
import { Trans, useLingui } from "@lingui/react";
import { Mail, Trash2, KeyRound } from "lucide-react";
import React, { useState } from "react";
import { FormField, PasswordField } from "@/components/ui/form-field";
import { Separator } from "@/components/ui/separator";
import { AlertConfig } from "../../components/ms-alert/Alert";
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus, StatusUserPoint, TypeAlertColor } from "../../general/structure/Constant";
import { ResponseI, showMessage, UserI } from "../../general/structure/Utils";
import { TypeMessage } from "../page-layout/PageLayout";
import "./SettingsContent.css";
import { savePassword, updateStatus } from "./service/SettingsService";

const MIN_PASSWORD_LENGTH = 8;

const DEMO_ACCOUNTS_NO_PASSWORD_CHANGE = new Set(
  ["user@simulated.com", "child@simulated.com"].map((e) => e.toLowerCase())
);

const isDemoAccountBlockingPasswordChange = (email: string | undefined): boolean => {
  if (!email) return false;
  return DEMO_ACCOUNTS_NO_PASSWORD_CHANGE.has(email.trim().toLowerCase());
};

interface SettingsContentProps {
  user: UserI;
  alertConfig: AlertConfig;
  isVertical: boolean;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ user, alertConfig }) => {
  const { i18n } = useLingui();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const demoPasswordBlocked = isDemoAccountBlockingPasswordChange(user.emailUserCurrent);

  const handleDeleteAccount = () => {
    updateStatus(
      { ...user, status: StatusUserPoint.DISACTIVE },
      (message?: TypeMessage) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
    )
      .then((response: ResponseI | undefined) => {
        if (response?.status === HttpStatus.OK) {
          console.log("Eliminazione account per:", user.emailUserCurrent);
        }
      })
      .catch((error) => {
        console.error("Errore durante l'eliminazione dell'account:", error);
      });
  };

  const handlePasswordAccount = () => {
    if (demoPasswordBlocked) {
      showMessage(alertConfig.setOpen, alertConfig.setMessage, {
        titleMessage: i18n._("password_account"),
        typeMessage: TypeAlertColor.ERROR,
        message: [i18n._("settings_password_demo_disabled")],
      });
      return;
    }

    const password = newPassword.trim();
    if (!password) {
      showMessage(alertConfig.setOpen, alertConfig.setMessage, {
        titleMessage: i18n._("settings_password_required_title"),
        typeMessage: TypeAlertColor.ERROR,
        message: [i18n._("settings_password_required")],
      });
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      showMessage(alertConfig.setOpen, alertConfig.setMessage, {
        titleMessage: i18n._("settings_password_min_title"),
        typeMessage: TypeAlertColor.ERROR,
        message: [i18n._("settings_password_min_length")],
      });
      return;
    }

    savePassword(
      { ...user, password },
      (message?: TypeMessage) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
    )
      .then((response: ResponseI | undefined) => {
        if (response?.status === HttpStatus.OK) {
          setNewPassword("");
          setShowPassword(false);
        }
      })
      .catch((error) => {
        console.error("Errore durante il cambio password dell'account:", error);
      });
  };

  const pulsanteElimina: Pulsante = {
    icona: "fas fa-trash-alt",
    funzione: handleDeleteAccount,
    nome: ButtonName.RED,
    title: i18n._("elimina_account"),
    configDialogPulsante: { message: i18n._("elimina_account_message"), showDialog: true },
  };

  const pulsanteCambioPassword: Pulsante = {
    icona: "fas fa-key",
    funzione: handlePasswordAccount,
    nome: ButtonName.BLUE,
    title: i18n._("password_account"),
    disableButton: demoPasswordBlocked || newPassword.trim().length < MIN_PASSWORD_LENGTH,
    configDialogPulsante: { message: i18n._("cambio_password_account_message"), showDialog: true },
  };

  return (
    <div className="settings-box">
      <p className="settings-header-text text-sm text-[var(--color-text-muted)]">
        <Trans id="preferenze_account" /> <strong>{user?.emailUserCurrent}</strong>
      </p>

      <div className="settings-content">
        <div className="settings-section-card rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
          <div className="section-header px-4 pt-4">
            <p className="section-title text-sm font-semibold">
              <Trans id="sicurezza_privacy" />
            </p>
          </div>

          <Separator />

          <div className="action-row settings-action-card flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="action-info flex items-start gap-3">
              <Trash2 className="delete-icon size-6 shrink-0 text-[var(--color-danger)]" />
              <div className="settings-action-text-block">
                <p className="action-title font-medium">
                  <Trans id="elimina_account" />
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  <Trans id="cancellazione_account" />
                </p>
              </div>
            </div>
            <div className="action-button-container">
              <Button pulsanti={[pulsanteElimina]} />
            </div>
          </div>

          <Separator />

          <div className="action-row settings-action-card flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="action-info flex flex-1 items-start gap-3">
              <KeyRound className="delete-icon size-6 shrink-0 text-[var(--color-primary)]" />
              <div className="settings-action-text-block w-full max-w-md">
                <p className="action-title font-medium">
                  <Trans id="password_account" />
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  <Trans id="cambio_password_account" />
                </p>
                <div className="settings-password-wrap mt-3">
                  <PasswordField
                    id="settings-new-password"
                    label={i18n._("nuova_password")}
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                    disabled={demoPasswordBlocked}
                    autoComplete="new-password"
                    showPassword={showPassword}
                    onToggleVisibility={() => setShowPassword((v) => !v)}
                    toggleLabel={showPassword ? i18n._("nascondi_password") : i18n._("mostra_password")}
                  />
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {demoPasswordBlocked
                      ? i18n._("settings_password_demo_disabled")
                      : i18n._("settings_password_min_hint")}
                  </p>
                </div>
              </div>
            </div>
            <div className="action-button-container">
              <Button pulsanti={[pulsanteCambioPassword]} />
            </div>
          </div>

          <Separator />

          <div className="action-row settings-action-card flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="action-info flex items-start gap-3">
              <Mail className="delete-icon size-6 shrink-0 text-[var(--color-primary)]" />
              <div className="settings-action-text-block">
                <p className="action-title font-medium">
                  <Trans id="notifiche_email" />
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  <Trans id="frequenza_avvisi" />
                </p>
              </div>
            </div>
            <div className="action-button-container">
              <Button pulsanti={[]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
