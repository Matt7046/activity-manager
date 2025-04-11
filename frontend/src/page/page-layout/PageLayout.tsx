import { Box, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { googleLogout } from '@react-oauth/google';
import React, { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { navigateRouting, showMessage } from '../../App';
import Alert from '../../components/ms-alert/Alert';
import Button, { Pulsante } from '../../components/ms-button/Button';
import Drawer, { MenuLaterale } from '../../components/ms-drawer/Drawer';
import Popover, { PopoverNotification } from '../../components/ms-popover/Popover';
import { ButtonName, HttpStatus, SectionName, TypeAlertColor } from '../../general/Constant';
import { NotificationI, ResponseI, UserI } from '../../general/Utils';
import { getNotificationsByIdentificativo, saveNotification } from '../page-notification/service/NotificationService';

interface PageLayoutProps {
  children: React.ReactNode; // Contenuto specifico della maschera
  menuLaterale: MenuLaterale[][];
  user: UserI;
  open: boolean;
  message: TypeMessage;
  handleClose: () => void;
  navigate: NavigateFunction; // Gestione padding dinamico
}
export interface TypeMessage {
  message?: string[];
  typeMessage?: TypeAlertColor;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  user,
  menuLaterale,
  open,
  message,
  handleClose,
  navigate,
}) => {

  const logout = (): void => {
    googleLogout();
    navigateRouting(navigate, SectionName.ROOT, {})
  }

  const [openAnchor, setOpenAnchor] = useState(false);
  const notify: NotificationI[] = [];
  const [notifications, setNotifications] = useState(notify);
  const [popoverNotifications, setPopoverNotifications] = useState<PopoverNotification[]>([]);
  const [messageLayout, setMessageLayout] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe
  const [openLayout, setOpenLayout] = useState(false); // Controlla la visibilità del messaggio


  const handleClickAnchor = () => {   
    getNotificationsByIdentificativo(user.emailUserCurrent, 0, 5).then((response: ResponseI) => {
      setNotifications(response.jsonText);
      const popover: PopoverNotification[] = response.jsonText.map((x: NotificationI) => {
        const popoverNotification = {
          message: x.message,
          subText: ['Inviato da: ' + x.userSender, 'data: ' +new Date(x.dateSender).toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })]
        }
        return popoverNotification;

      });
      setPopoverNotifications(popover);
      setOpenAnchor(true); // Mostra il popover
    })

  };

  // Funzione per chiudere il popover
  const handleCloseAnchor = () => {
    setOpenAnchor(false); // Nasconde il popover
  };





  const pulsanteNotification: Pulsante = {
    icona: 'fas fa-check-circle',
    funzione: () => saveReadNotification(), // Passi la funzione direttamente
    //disableButton: disableButtonSave,
    nome: ButtonName.BLUE,
    title: 'Visualizzate',
    configDialogPulsante: { message: 'Vuoi impostate le notifiche come lette?', showDialog: true }

  };

  const saveReadNotification = () => {
    const notificationsStatusRead = notifications.map(x => {
      x.status = "READ";
      return x;
    });
    saveNotification(notificationsStatusRead, (messageLayout?: TypeMessage) => showMessage(setOpenLayout, setMessageLayout, messageLayout)).then((response) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
        }
      }
    })
  }


  const pulsanteNotifiche: Pulsante = {
    icona: 'fas fa-clipboard',
    funzione: (event) => handleClickAnchor(), // Passi la funzione direttamente
    nome: ButtonName.BLUE,
    title: 'Notifiche',
    visibility: user ? true : false,
    configDialogPulsante: { message: '', showDialog: false }
  };

  const pulsanteLogout: Pulsante = {
    icona: 'fas fa-sign-out-alt',
    funzione: () => logout(), // Passi la funzione direttamente
    nome: ButtonName.RED,
    title: 'Logout',
    visibility: user ? true : false,
    configDialogPulsante: { message: '', showDialog: false }
  };

  const id = 'simple-popover';


  return (
    <>
      <Box sx={{ paddingLeft: 0.5 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />

          <Box sx={{ paddingRight: 2, display: 'flex', gap: 2 }}>
            <Button pulsanti={[pulsanteNotifiche]} />
            <Button pulsanti={[pulsanteLogout]} />
            {/* Area notifica */}
            <Popover
              notifications={popoverNotifications}
              openAnchor={openAnchor}
              handleCloseAnchor={handleCloseAnchor}
              pulsanteNotification={pulsanteNotification}>
            </Popover>
          </Box>
        </Grid>
      </Box>
      {/* Mostra l'alert se open è true */}
      {open && (
        <Alert onClose={handleClose} message={message} />
      )}

      <div className="row">
        <Box sx={{ padding: 2 }}>
          <div id="text-box-email">
            <TextField
              id="emailFamily"
              label='Child Email'
              variant="standard"
              value={user.emailFamily} // Collega il valore allo stato
              // onChange={handleChangeEmailFamily} // Aggiorna lo stato quando cambia
              fullWidth
              disabled={true} />
          </div>
        </Box>

      </div>
      {children}

    </>
  );
}

export default PageLayout;


