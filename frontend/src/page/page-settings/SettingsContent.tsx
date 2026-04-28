import { Trans, useLingui } from "@lingui/react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";
import { AlertConfig } from "../../components/ms-alert/Alert";
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus, StatusUserPoint } from "../../general/structure/Constant";
import { ResponseI, UserI } from "../../general/structure/Utils";
import { showMessage } from "../page-home/HomeContent";
import { TypeMessage } from "../page-layout/PageLayout";
import "./SettingsContent.css"; // Riutilizziamo il CSS esistente
import { updateStatus } from "./service/SettingsService";

interface SettingsContentProps {
  user: UserI;
  alertConfig: AlertConfig;
  isVertical: boolean;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ user, alertConfig }) => {

  const { i18n } = useLingui();
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

  const pulsanteElimina: Pulsante = {
    icona: 'fas fa-trash-alt',
    funzione: handleDeleteAccount,
    nome: ButtonName.RED, // Assumendo che RED sia definito per azioni distruttive
    title: i18n._("Elimina Account"),
    configDialogPulsante: {
      message: i18n._("elimina_account_message"),
      showDialog: true
    }
  };

  return (
    <Box className="popover-box">
      {/* INTESTAZIONE PAGINA */}
      <Box className="profile-header">
        <Box className="header-title-row">
          <SettingsIcon className="header-icon" />
          <Typography variant="h6" className="header-title">
            <Trans id="impostazione_profilo" />
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          <Trans id="preferenze_account" /> <strong>{user.emailUserCurrent}</strong>
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
          <Box className="action-row">
            <Box className="action-info">
              <DeleteForeverIcon className="delete-icon" />
              <Box>
                <Typography variant="subtitle1" className="action-title">
                  <Trans id="elimina_account" />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Trans id="cancellazione_account" />
                </Typography>
              </Box>
            </Box>

            <Box>
              <Button pulsanti={[pulsanteElimina]} />
            </Box>
          </Box>

          <Divider />

          {/* ESEMPIO PROSSIMA AZIONE (Placeholder) */}
          <Box className="action-disabled">
            <Box>
              <Typography variant="subtitle1" className="action-title">
                <Trans id="notifiche_email" />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Trans id="frequenza_avvisi" />
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default SettingsContent;