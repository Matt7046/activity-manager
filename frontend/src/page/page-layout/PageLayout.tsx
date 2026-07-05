"use client";
import { useLingui } from "@lingui/react";
import { googleLogout } from "@react-oauth/google";
import React, { useEffect, useRef, useState } from "react";

import { useUser } from "@/context/UserContext";
import { FormField } from "@/components/ui/form-field";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Alert, { AlertConfig } from "../../components/ms-alert/Alert";
import Button, { Pulsante } from "../../components/ms-button/Button";
import Drawer, { MenuLaterale } from "../../components/ms-drawer/Drawer";
import Label from "../../components/ms-label/Label";
import Language from "../../components/ms-language/Language";
import Popover, { PopoverNotification } from "../../components/ms-popover/Popover";
import ThemeToggle from "../../components/ms-theme-toggle/ThemeToggle";
import {
  ButtonName,
  HttpStatus,
  PUBLIC_SECTION_PATHS,
  SectionName,
  StatusNotification,
  TypeAlertColor,
  TypeUser,
} from "../../general/structure/Constant";
import SocketFamilyPoint from "../../general/structure/SocketFamilyPoint";
import { notificationWebSocketUrl } from "../../general/structure/SocketUrl";
import {
  FamilyNotificationI,
  getUserChildDisplay,
  getNotificationParts,
  getDateStringRegularFormat,
  getTranslatedNotification,
  navigateRouting,
  NotificationI,
  ResponseI,
  showMessage,
} from "../../general/structure/Utils";
import { getNotificationsByIdentificativo, saveNotification } from "../page-notification/service/NotificationService";
import "./PageLayout.css";

interface PageLayoutProps {
  section: MenuLaterale;
  menuLaterale?: MenuLaterale[][];
  alertConfig: AlertConfig;
  isVertical: boolean;
  showEmail?: boolean;
  handleClose: () => void;
  navigate: AppRouterInstance;
  children: React.ReactNode;
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
  showEmail = true,
  handleClose,
  navigate,
}) => {
  const { user, setUser } = useUser();
  const { i18n } = useLingui();

  const logout = (): void => {
    googleLogout();
    setUser(null);
    SocketFamilyPoint.resetInstance();
    navigateRouting(navigate, SectionName.ROOT, {});
  };

  const [openAnchor, setOpenAnchor] = useState(false);
  const notify: NotificationI[] = [];
  const [notifications, setNotifications] = useState(notify);
  const [popoverNotifications, setPopoverNotifications] = useState<PopoverNotification[]>([]);
  const [messageLayout, setMessageLayout] = React.useState<TypeMessage>({});
  const [openLayout, setOpenLayout] = useState(false);
  void messageLayout;
  void openLayout;
  void setMessageLayout;
  void setOpenLayout;

  const sectionAttiva =
    (menuLaterale ?? []).flat().find((item) => item?.testo === section?.testo) ?? section;
  const IconaTitolo = sectionAttiva?.icon;

  const handleClickAnchor = () => {
    setOpenAnchor(true);

    const email = user?.emailUserCurrent?.trim();
    if (!email) {
      setPopoverNotifications([]);
      return;
    }

    getNotificationsByIdentificativo(email, 0, 3, StatusNotification.NOT_READ)
      .then((response: ResponseI | undefined) => {
        try {
          const items = Array.isArray(response?.jsonText) ? response.jsonText : [];
          setNotifications(items);
          const popover: PopoverNotification[] = items.map((x: NotificationI) => {
            const { title, subText: messageSubText } = getNotificationParts(x.message ?? "", i18n);
            return {
              message: title,
              subText: [
                ...(messageSubText ? [messageSubText] : []),
                i18n._("inviato_da") + (x.userSender ?? ""),
                i18n._("data_invio") + getDateStringRegularFormat(x.dateSender),
              ],
            };
          });
          setPopoverNotifications(popover);
        } catch {
          setPopoverNotifications([]);
        }
      })
      .catch(() => {
        setPopoverNotifications([]);
      });
  };

  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const email = user?.emailUserCurrent?.trim();
    if (!email) {
      return;
    }

    let disposed = false;
    const wsUrl = notificationWebSocketUrl(email);

    const attachHandlers = (socket: WebSocket) => {
      socket.onmessage = (event) => {
        console.log("Messaggio ricevuto:", event.data);
        const familyNotification: FamilyNotificationI = JSON.parse(event.data);
        const testoKey = getTranslatedNotification(familyNotification.message, i18n);
        const typeMessage: TypeMessage = {
          message: [testoKey],
          typeMessage: TypeAlertColor.INFO,
        };
        showMessage(alertConfig.setOpen, alertConfig.setMessage, typeMessage);
      };
      socket.onclose = () => {
        console.warn("WebSocket chiuso");
      };
    };

    void SocketFamilyPoint.reconnect(user, wsUrl).then((socketFamilyPoint) => {
      if (disposed) {
        return;
      }
      const socket = socketFamilyPoint.getSocket();
      attachHandlers(socket);

      pingIntervalRef.current = setInterval(() => {
        if (disposed) {
          return;
        }
        if (socket.readyState === WebSocket.OPEN) {
          socket.send("ping");
        } else {
          void SocketFamilyPoint.reconnect(user, wsUrl);
        }
      }, 30000);
    });

    return () => {
      disposed = true;
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };
  }, [user?.emailUserCurrent]);

  const pulsanteNotification: Pulsante = {
    icona: "fas fa-check-circle",
    funzione: () => saveReadNotification(),
    nome: ButtonName.BLUE,
    title: i18n._("visualizzate"),
    configDialogPulsante: {
      message: i18n._("vuoi_impostate_le_notifiche_come_lette"),
      showDialog: true,
    },
  };

  const saveReadNotification = () => {
    const notificationsStatusRead = notifications.map((x) => {
      x.status = "READ";
      return x;
    });
    saveNotification(notificationsStatusRead, (messageLayout?: TypeMessage) =>
      showMessage(setOpenLayout, setMessageLayout, messageLayout)
    ).then((response) => {
      if (response?.status === HttpStatus.OK) {
        void response;
      }
    });
  };

  const pulsanteNotifiche: Pulsante = {
    icona: "fas fa-clipboard",
    funzione: () => handleClickAnchor(),
    nome: ButtonName.BLUE,
    title: i18n._("notifiche"),
    visibility: !!user,
    configDialogPulsante: { message: "", showDialog: false },
  };

  const pulsanteLogout: Pulsante = {
    icona: "fas fa-sign-out-alt",
    funzione: () => logout(),
    nome: ButtonName.RED,
    title: i18n._("logout"),
    visibility: !!user,
    configDialogPulsante: { message: "", showDialog: false },
  };

  const tutoredUserDisplay = getUserChildDisplay(user);
  const showUserEmailField = Boolean(
    user?.emailUserCurrent?.trim() || user?.emailChild?.trim() || user?.email?.trim()
  );

  const emailLabel =
    user?.emailUserCurrent === user?.emailChild
      ? i18n._("email_registrazione")
      : i18n._("email_tutorato");

  const annotationRows = sectionAttiva?.path === SectionName.HOME ? 2 : 4;

  return (
    <>
      <div className="page-layout-root">
        <div className="box-layout px-4 max-sm:px-2">
        <header className="page-layout-header">
          <div className="page-layout-header__start">
            {menuLaterale && menuLaterale.length > 0 && (
              <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
            )}
          </div>

          <div className="page-layout-header__center">
            <div className="header-title-badge">
              {IconaTitolo && <IconaTitolo className="header-icon" aria-hidden />}
              <h6 className="header-title">
                <Label
                  _id={"title"}
                  text={
                    sectionAttiva?.testo?.toUpperCase() +
                    (TypeUser.FAMILY === user?.type ? i18n._("tutorato")?.toUpperCase() : "")
                  }
                />
              </h6>
            </div>
          </div>

          <div className="page-layout-header__end">
            <div className="language-container">
              <ThemeToggle placement="header" />
              <Language placement="header" />
            </div>
            {sectionAttiva?.path !== null && !PUBLIC_SECTION_PATHS.has(sectionAttiva.path!) && (
              <Popover
                open={openAnchor}
                onOpenChange={setOpenAnchor}
                trigger={<Button pulsanti={[pulsanteNotifiche]} />}
                notifications={popoverNotifications}
                pulsanteNotification={pulsanteNotification}
              />
            )}
            <Button pulsanti={[pulsanteLogout]} />
          </div>
        </header>

        <div className={isVertical ? "box-layout-text-vertical w-full" : "box-layout-text w-full"}>
          {showEmail ? (
            showUserEmailField ? (
              <FormField
                id="emailFamily"
                label={emailLabel}
                value={tutoredUserDisplay}
                disabled
                readOnly
              />
            ) : null
          ) : sectionAttiva?.annotazione ? (
            <FormField
              id="sectionAnnotation"
              label={i18n._("annotation_title")}
              value={i18n._(sectionAttiva.annotazione)}
              disabled
              readOnly
              multiline
              rows={annotationRows}
            />
          ) : (
            <FormField
              id="emailFamily"
              label={i18n._("login_simulati_title")}
              value={i18n._("login_simulati")}
              disabled
              readOnly
              multiline
              rows={annotationRows}
            />
          )}
        </div>
      </div>

      <div className="layout-alert flex justify-end">
        {alertConfig.open && <Alert onClose={handleClose} message={alertConfig.message} />}
      </div>

      <div className="page-layout-body">{children}</div>
      </div>
    </>
  );
};

export default PageLayout;
