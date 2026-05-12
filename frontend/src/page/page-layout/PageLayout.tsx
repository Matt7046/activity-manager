"use client";
import { useLingui } from "@lingui/react";
import { Box, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { googleLogout } from '@react-oauth/google';
import React, { useEffect, useRef, useState } from 'react';

import { useUser } from '@/context/UserContext';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Alert, { AlertConfig } from '../../components/ms-alert/Alert';
import Button, { Pulsante } from '../../components/ms-button/Button';
import Drawer, { MenuLaterale } from '../../components/ms-drawer/Drawer';
import Label from '../../components/ms-label/Label';
import Language from "../../components/ms-language/Language";
import ThemeToggle from "../../components/ms-theme-toggle/ThemeToggle";
import Popover, { PopoverNotification } from '../../components/ms-popover/Popover';
import { ButtonName, HttpStatus, SectionName, StatusNotification, TypeAlertColor, TypeUser } from '../../general/structure/Constant';
import SocketFamilyPoint from '../../general/structure/SocketFamilyPoint';
import { SocketURL } from '../../general/structure/SocketUrl';
import { FamilyNotificationI, getDateStringRegularFormat, getTranslatedNotification, NotificationI, ResponseI, showMessage } from '../../general/structure/Utils';
import { getNotificationsByIdentificativo, saveNotification } from '../page-notification/service/NotificationService';
import "./PageLayout.css";



interface PageLayoutProps {
  section: MenuLaterale
  menuLaterale?: MenuLaterale[][];
  alertConfig: AlertConfig
  isVertical: boolean;
  hiddenEmail?: boolean;
  handleClose: () => void;
  navigate: AppRouterInstance; // Gestione padding dinamico
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

  useEffect(() => {
    // Accesso a pagine interne senza utente: vai alla root (presentazione), non a URL malformati tipo "//".
    if (!user?.email && section.path !== SectionName.ROOT && section.path !== SectionName.HOME && section.path !== SectionName.REGISTER && section.path !== SectionName.PERSONALITY) {
      navigate.replace('/');
    }
  }, [user, navigate, section.path]);



  const logout = (): void => {
    googleLogout();
    setUser(null);
    SocketFamilyPoint.resetInstance();
    navigate.replace('/');
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
    getNotificationsByIdentificativo(user.emailUserCurrent, 0, 3, StatusNotification.NOT_READ).then((response: ResponseI) => {
      setNotifications(response.jsonText);
      const popover: PopoverNotification[] = response.jsonText.map((x: NotificationI) => {
        const testoKey = getTranslatedNotification(x.message, i18n)
        const popoverNotification = {
          message: testoKey,
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
        const testoKey = getTranslatedNotification(familyNotification.message, i18n)
        const message = testoKey
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


        {/* RIGA COMANDI: Menu Drawer + Bottoni */}
        <Grid
          container
          className={`grid-menu ${isVertical ? 'vertical-layout' : 'horizontal-layout'}`}
          alignItems="center"
        >
          <Box className="title-container">
            <Box className="header-title-badge">
              {IconaTitolo && <IconaTitolo className="header-icon" />}
              <Typography variant="h6" className="header-title">
                <Label
                  _id={'title'}
                  text={sectionAttiva?.testo?.toUpperCase() + (TypeUser.FAMILY === user?.type ? i18n._('tutorato')?.toUpperCase() : '')}
                />
              </Typography>
            </Box>
          </Box>
          {/* Se il menu esiste, viene renderizzato a sinistra */}
            <Box  className ="box-menu-laterale">
            {menuLaterale && menuLaterale.length > 0 && (
              <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
            )}

            {/* SPACER: Questo Box con flex-grow spinge tutto ciò che segue a destra */}
            <Box className="box-layout-spacer" />

            {/* Contenitore pulsanti: ora sarà SEMPRE allineato a destra */}
            <Box className='box-layout-right-button'>
              <Box className="box-layout-theme-lang-group">
                <ThemeToggle placement="header" />
                <Language placement="header" />
              </Box>
              {/* Mostra il bottone notifiche solo se NON siamo in home o in registrazione */}
              {(sectionAttiva.path !== SectionName.HOME && sectionAttiva.path !== SectionName.REGISTER &&  sectionAttiva.path !== SectionName.PERSONALITY) && (
                <>
                  <Button pulsanti={[pulsanteNotifiche]} />
                  <Popover
                    notifications={popoverNotifications}
                    openAnchor={openAnchor}
                    handleCloseAnchor={handleCloseAnchor}
                    pulsanteNotification={pulsanteNotification}
                  />
                </>
              )}

              <Button pulsanti={[pulsanteLogout]} />
            </Box>
          </Box>
        </Grid>

        {/* AREA EMAIL/ANNOTAZIONE */}
        {!hiddenEmail && (
          <Box className={isVertical ? "box-layout-text-vertical" : "box-layout-text"}>
            <TextField
              id="emailFamily"
              className="form-control-operative"
              label={
                user?.emailUserCurrent && !hiddenEmail
                  ? (user?.emailUserCurrent === user?.emailChild ? i18n._('email_registrazione') : i18n._('email_tutorato'))
                  : i18n._('login_simulati_title')
              }
              variant="standard"
              value={user?.emailChild || i18n._('login_simulati')}
              fullWidth
              disabled
              multiline // <--- Abilita il wrapping del testo
              maxRows={4} // Opzionale: limita l'altezza massima
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


