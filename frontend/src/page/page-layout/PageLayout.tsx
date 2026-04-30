import { useLingui } from "@lingui/react";
import { Box, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { googleLogout } from '@react-oauth/google';
import React, { useEffect, useRef, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { useUser } from '../../App';
import Alert, { AlertConfig } from '../../components/ms-alert/Alert';
import Button, { Pulsante } from '../../components/ms-button/Button';
import Drawer, { MenuLaterale } from '../../components/ms-drawer/Drawer';
import Label from '../../components/ms-label/Label';
import Language from "../../components/ms-language/Language";
import Popover, { PopoverNotification } from '../../components/ms-popover/Popover';
import { ButtonName, HttpStatus, SectionName, StatusNotification, TypeAlertColor, TypeUser } from '../../general/structure/Constant';
import SocketFamilyPoint from '../../general/structure/SocketFamilyPoint';
import { SocketURL } from '../../general/structure/SocketUrl';
import { estraiTestoKeyNotification, FamilyNotificationI, getDateStringRegularFormat, NotificationI, ResponseI } from '../../general/structure/Utils';
import { navigateRouting, showMessage } from '../page-home/HomeContent';
import { getNotificationsByIdentificativo, saveNotification } from '../page-notification/service/NotificationService';
import "./PageLayout.css";


interface PageLayoutProps {
  section: MenuLaterale
  menuLaterale?: MenuLaterale[][];
  alertConfig: AlertConfig
  isVertical: boolean;
  hiddenEmail?: boolean;
  handleClose: () => void;
  navigate: NavigateFunction; // Gestione padding dinamico
  children: React.ReactNode; // Contenuto specifico della maschera
}
export interface TypeMessage {
  titleMessage?: string;
  message?: string[];
  typeMessage?: TypeAlertColor;
}

const PageLayout: React.FC<PageLayoutProps> = ({

  section,
  children,
  menuLaterale,
  alertConfig,
  isVertical,
  hiddenEmail,
  handleClose,
  navigate,
}) => {
  const { user, setUser } = useUser();
  const { i18n } = useLingui();
  const logout = (): void => {
    googleLogout();

    setUser(null);
    navigateRouting(navigate, SectionName.ROOT, {})
  }


  const [openAnchor, setOpenAnchor] = useState(false);
  const notify: NotificationI[] = [];
  const [notifications, setNotifications] = useState(notify);
  const [popoverNotifications, setPopoverNotifications] = useState<PopoverNotification[]>([]);
  const [messageLayout, setMessageLayout] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe
  const [openLayout, setOpenLayout] = useState(false); // Controlla la visibilità del messaggio  

  // Cerca nel menu, se non lo trova usa l'oggetto section passato come fallback
  // Se menuLaterale è null, usiamo un array vuoto per evitare errori su .flat()
  const sectionAttiva = (menuLaterale ?? [])
    .flat()
    .find(item => item?.testo === section?.testo) ?? section;
  const IconaTitolo = sectionAttiva?.icon;
  const handleClickAnchor = () => {
    getNotificationsByIdentificativo(user.emailUserCurrent, 0, 3, StatusNotification.SEND).then((response: ResponseI) => {
      setNotifications(response.jsonText);
      const popover: PopoverNotification[] = response.jsonText.map((x: NotificationI) => {
        const testoKey = estraiTestoKeyNotification(x.message)
        const popoverNotification = {
          message: testoKey?.testo +" " + i18n._(testoKey.key) + " " + testoKey.resto,
          subText: [i18n._("inviato_da") + x.userSender, i18n._("data_invio") + getDateStringRegularFormat(x.dateSender)]
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
  const socketRef = useRef<WebSocket | null>(null);

  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      const socketFamilyPoint = SocketFamilyPoint.getInstance(user, SocketURL.NOTIFICATION + user?.emailUserCurrent);
      socketRef.current = socketFamilyPoint.getSocket();
      // Ping ogni 30 secondi
      pingIntervalRef.current = setInterval(() => {
        if (socketFamilyPoint.getSocket().readyState === WebSocket.OPEN) {
          socketFamilyPoint.getSocket().send("ping");
        }
        else {
          SocketFamilyPoint.reconnect(user, SocketURL.NOTIFICATION + user?.emailUserCurrent);
        }
      }, 30000);
      socketFamilyPoint.getSocket().onmessage = (event) => {
        console.log("Messaggio ricevuto:", event.data);
        const familyNotification: FamilyNotificationI = JSON.parse(event.data);
        const testoKey = estraiTestoKeyNotification(familyNotification.message)
        const message = testoKey?.testo +" " + i18n._(testoKey.key) + " " + testoKey.resto
        const typeMessage: TypeMessage = {
          message: [message],
          typeMessage: TypeAlertColor.INFO
        }

        showMessage(alertConfig.setOpen, alertConfig.setMessage, typeMessage);
      };
      socketFamilyPoint.getSocket().onclose = () => {
        console.warn("WebSocket chiuso");
      };


      return () => {
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
      };
    }
  }, [user]);




  const pulsanteNotification: Pulsante = {
    icona: 'fas fa-check-circle',
    funzione: () => saveReadNotification(), // Passi la funzione direttamente
    //disableButton: disableButtonSave,
    nome: ButtonName.BLUE,
    title: i18n._("visualizzate"),
    configDialogPulsante: { message: i18n._("vuoi_impostate_le_notifiche_come_lette"), showDialog: true }

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
    title: i18n._("notifiche"),
    visibility: user ? true : false,
    configDialogPulsante: { message: '', showDialog: false }
  };

  const pulsanteLogout: Pulsante = {
    icona: 'fas fa-sign-out-alt',
    funzione: () => logout(), // Passi la funzione direttamente
    nome: ButtonName.RED,
    title: i18n._("logout"),
    visibility: user ? true : false,
    configDialogPulsante: { message: '', showDialog: false }
  };

  return (
    <>
      <Box className="box-layout">
        {/* INTESTAZIONE: Titolo e Icona (Sempre centrati) */}
        <Box className="title-container">
          {IconaTitolo && <IconaTitolo className="header-icon" />}
          <Typography variant="h6" className="header-title">
            <Label
              _id={'title'}
              text={sectionAttiva?.testo + (TypeUser.FAMILY === user?.type ? i18n._('tutorato') : '')}
            />
          </Typography>
        </Box>

        {/* RIGA COMANDI: Menu Drawer + Bottoni */}
        <Grid
          container
          className={`grid-menu ${isVertical ? 'vertical-layout' : 'horizontal-layout'}`}
          alignItems="center"
        >
          {/* Se il menu esiste, viene renderizzato a sinistra */}
          {menuLaterale && menuLaterale.length > 0 ? (
            <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
          ) : (
            /* Se il menu NON esiste, mettiamo un segnaposto invisibile o 
               lasciamo che il CSS gestisca lo spazio */
            <Box />
          )}

          {/* Aggiungiamo 'ml-auto' o gestiamo via CSS per spingere a destra */}
          <Box className='box-layout-right-button'>
            {location.pathname !== '/home' && <Button pulsanti={[pulsanteNotifiche]} />}
            <Button pulsanti={[pulsanteLogout]} />
            <Language />
            <Popover
              notifications={popoverNotifications}
              openAnchor={openAnchor}
              handleCloseAnchor={handleCloseAnchor}
              pulsanteNotification={pulsanteNotification}
            />
          </Box>
        </Grid>

        {/* AREA EMAIL: Visibile solo se necessario */}
        {user?.emailUserCurrent && !hiddenEmail && (
          <Box className={isVertical ? "box-layout-text-vertical" : "box-layout-text"}>
            <TextField
              id="emailFamily"
              className="form-control-operative"
              label={
                user?.emailUserCurrent === user?.emailChild
                  ? i18n._('email_registrazione')
                  : i18n._('email_tutorato')
              }
              variant="standard"
              value={user?.emailChild || ''}
              fullWidth
              disabled
            />
          </Box>
        )}
      </Box>

      <Grid container justifyContent="flex-end" className="layout-alert">
        {alertConfig.open && <Alert onClose={handleClose} message={alertConfig.message} />}
      </Grid>

      {children}
    </>
  );
}

export default PageLayout;


