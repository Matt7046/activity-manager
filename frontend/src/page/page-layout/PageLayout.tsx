import { Box, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { googleLogout } from '@react-oauth/google';
import React, { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { navigateRouting, showMessage } from '../../App';
import Alert from '../../components/ms-alert/Alert';
import Button, { Pulsante } from '../../components/ms-button/Button';
import Drawer, { MenuLaterale } from '../../components/ms-drawer/Drawer';
import Label from '../../components/ms-label/Label';
import Popover, { PopoverNotification } from '../../components/ms-popover/Popover';
import { ButtonName, HttpStatus, SectionName, TypeAlertColor } from '../../general/structure/Constant';
import { getDateStringRegularFormat, NotificationI, ResponseI, UserI } from '../../general/structure/Utils';
import { getNotificationsByIdentificativo, saveNotification } from '../page-notification/service/NotificationService';
import "./PageLayout.css";


interface PageLayoutProps {
  title: string
  children: React.ReactNode; // Contenuto specifico della maschera
  menuLaterale?: MenuLaterale[][];
  user: UserI;
  open: boolean;
  message: TypeMessage;
  isVertical: boolean;
  handleClose: () => void;
  navigate: NavigateFunction; // Gestione padding dinamico
}
export interface TypeMessage {
  message?: string[];
  typeMessage?: TypeAlertColor;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  user,
  menuLaterale,
  open,
  message,
  isVertical,
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
          subText: ['Inviato da: ' + x.userSender, 'data: ' + getDateStringRegularFormat(x.dateSender)]

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
      <Box className="box-layout">
        {isVertical ? (
          <>
            {/* Riga 1: Menu + Pulsanti */}
            <Label _id={'title'} text={title}></Label>
            <Grid container justifyContent="space-between" alignItems="center" spacing={2}>


              {menuLaterale && menuLaterale.length > 0 && (
                <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
              )}
              <Box className='box-layout-right-button'>
                <Button pulsanti={[pulsanteNotifiche]} />
                <Button pulsanti={[pulsanteLogout]} />
                <Popover
                  notifications={popoverNotifications}
                  openAnchor={openAnchor}
                  handleCloseAnchor={handleCloseAnchor}
                  pulsanteNotification={pulsanteNotification}
                />
              </Box>
            </Grid>

            {/* Riga 2: Email */}
            <Grid container>
              <Box className="box-layout-text-vertical">
                <TextField
                  id="emailFamily"
                  label={
                    user.emailUserCurrent === user.emailFamily
                      ? 'email di registrazione'
                      : 'Email tutelato'
                  }
                  variant="standard"
                  value={user.emailFamily}
                  fullWidth
                  disabled
                />
              </Box>
            </Grid>
          </>
        ) : (
          <>

            <Label _id={'title'} text={title}></Label>
            <Grid container justifyContent="space-between" alignItems="center" className='grid-menu'>
              {menuLaterale && menuLaterale.length > 0 && (
                <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
              )}
              <Box className="box-layout-text">
                <TextField
                  id="emailFamily"
                  label={user.emailUserCurrent === user.emailFamily
                    ? 'email di registrazione'
                    : 'Email tutelato'}
                  variant="standard"
                  value={user.emailFamily}
                  fullWidth
                  disabled />
              </Box>
              <Box className='box-layout-right-button'>
                <Button pulsanti={[pulsanteNotifiche]} />
                <Button pulsanti={[pulsanteLogout]} />
                <Popover
                  notifications={popoverNotifications}
                  openAnchor={openAnchor}
                  handleCloseAnchor={handleCloseAnchor}
                  pulsanteNotification={pulsanteNotification} />
              </Box>
            </Grid></>
        )}
      </Box>

      <Grid container justifyContent="flex-end" className="layout-alert">
        {open && <Alert onClose={handleClose} message={message} />}
      </Grid>

      {children}
    </>
  );

}

export default PageLayout;


