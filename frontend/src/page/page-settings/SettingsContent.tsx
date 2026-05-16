"use client";
import { Trans, useLingui } from "@lingui/react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Divider, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { AlertConfig } from "../../components/ms-alert/Alert";
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus, StatusUserPoint, TypeAlertColor } from "../../general/structure/Constant";
import { ResponseI, showMessage, UserI } from "../../general/structure/Utils";
import { TypeMessage } from "../page-layout/PageLayout";
import "./SettingsContent.css"; // Riutilizziamo il CSS esistente
import { savePassword, updateStatus } from "./service/SettingsService";

const MIN_PASSWORD_LENGTH = 8;

const DEMO_ACCOUNTS_NO_PASSWORD_CHANGE = new Set(
  ["user@simulated.com", "child@simulated.com"].map((e) => e.toLowerCase())
);

function isDemoAccountBlockingPasswordChange(email: string | undefined): boolean {
  if (!email) return false;
  return DEMO_ACCOUNTS_NO_PASSWORD_CHANGE.has(email.trim().toLowerCase());
}

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
  // Funzione per l'eliminazione account
  const handleDeleteAccount = () => {
    updateStatus({ ...user, status: StatusUserPoint.DISACTIVE }, (message?: TypeMessage) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message))
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

    const payload =  {...user, password};
    savePassword(payload, (message?: TypeMessage) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message))
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
    icona: 'fas fa-trash-alt',
    funzione: handleDeleteAccount,
    nome: ButtonName.RED, // Assumendo che RED sia definito per azioni distruttive
    title: i18n._("elimina_account"),
    configDialogPulsante: {
      message: i18n._("elimina_account_message"),
      showDialog: true
    }
  };

  const pulsanteCambioPassword: Pulsante = {
    icona: 'fas fa-key',
    funzione: handlePasswordAccount,
    nome: ButtonName.BLUE,
    title: i18n._("password_account"),
    disableButton: demoPasswordBlocked || newPassword.trim().length < MIN_PASSWORD_LENGTH,
    configDialogPulsante: {
      message: i18n._("cambio_password_account_message"),
      showDialog: true
    }
  };

  return (
    <Box className="settings-box">
      {/* INTESTAZIONE PAGINA */}

      <Box className="settings-box">
        {/* INTESTAZIONE PAGINA */}
        <Typography variant="body2" color="text.secondary" className="settings-header-text">
          <Trans id="preferenze_account" /> <strong>{user?.emailUserCurrent}</strong>
        </Typography>
      </Box>

      <Box className="settings-content">
        {/* SEZIONE: SICUREZZA E ACCOUNT */}
        <Paper elevation={0} className="settings-section-card">
          <Box className="section-header">
            <Typography variant="subtitle2" className="section-title">
              <Trans id="sicurezza_privacy" />
            </Typography>
          </Box>

          <Divider />

          {/* AZIONE: ELIMINAZIONE ACCOUNT */}
          <Box className="action-row settings-action-card">
            <Box className="action-info">
              <DeleteForeverIcon className="delete-icon" />
              <Box className="settings-action-text-block">
                <Typography variant="subtitle1" className="action-title">
                  <Trans id="elimina_account" />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Trans id="cancellazione_account" />
                </Typography>
              </Box>
            </Box>

            <Box className="action-button-container">
              <Button pulsanti={[pulsanteElimina]} />
            </Box>
          </Box>

          <Divider />

          {/* AZIONE: CAMBIO PASSWORD ACCOUNT */}
          <Box className="action-row settings-action-card">
            <Box className="action-info">
              <LockResetOutlinedIcon className="delete-icon" />
              <Box className="settings-action-text-block">
                <Typography variant="subtitle1" className="action-title">
                  <Trans id="password_account" />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Trans id="cambio_password_account" />
                </Typography>
                <Box className="settings-password-wrap">
                <TextField
                  className="settings-textfield settings-password-textfield"
                  id="settings-new-password"
                  label={i18n._("nuova_password")}
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={demoPasswordBlocked}
                  autoComplete="new-password"
                  helperText={
                    demoPasswordBlocked
                      ? i18n._("settings_password_demo_disabled")
                      : i18n._("settings_password_min_hint")
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment className="settings-password-adornment" position="end">
                        <IconButton
                          aria-label={showPassword ? i18n._("nascondi_password") : i18n._("mostra_password")}
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          size="small"
                          disabled={demoPasswordBlocked}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                </Box>
              </Box>
            </Box>

            <Box className="action-button-container">
              <Button pulsanti={[pulsanteCambioPassword]} />
            </Box>
          </Box>

          <Divider />

          {/* ESEMPIO PROSSIMA AZIONE (Placeholder) */}

          <Box className="action-row settings-action-card">
            <Box className="action-info">
              <EmailOutlinedIcon className="delete-icon" />
              <Box className="settings-action-text-block">
                <Typography variant="subtitle1" className="action-title">
                  <Trans id="notifiche_email" />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Trans id="frequenza_avvisi" />
                </Typography>
              </Box>
            </Box>

            <Box className="action-button-container">
              <Button pulsanti={[]} />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default SettingsContent;