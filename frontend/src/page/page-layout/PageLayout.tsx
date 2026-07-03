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
    getNotificationsByIdentificativo(user.emailUserCurrent, 0, 3, StatusNotification.NOT_READ).then(
      (response: ResponseI) => {
        setNotifications(response.jsonText);
        const popover: PopoverNotification[] = response.jsonText.map((x: NotificationI) => {
          const testoKey = getTranslatedNotification(x.message, i18n);
          return {
            message: testoKey,
            subText: [
              i18n._("inviato_da") + x.userSender,
              i18n._("data_invio") + getDateStringRegularFormat(x.dateSender),
            ],
          };
        });
        setPopoverNotifications(popover);
        setOpenAnchor(true);
      }
    );
  };

  const handleCloseAnchor = () => {
    setOpenAnchor(false);
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

  const emailLabel =
    user?.emailUserCurrent === user?.emailChild
      ? i18n._("email_registrazione")
      : i18n._("email_tutorato");

  return (
    <>
      <div className="box-layout px-4 max-sm:px-2">
        <div
          className={`grid-menu flex w-full pb-4 pt-px ${isVertical ? "vertical-layout flex-row justify-between" : "horizontal-layout justify-between"}`}
        >
          <div className="title-container flex w-full items-center justify-center gap-2 py-2">
            <div className="header-title-badge inline-flex items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[color-mix(in_srgb,var(--color-primary)_16%,var(--color-surface))] px-4 py-2.5 shadow-[var(--shadow-sm),inset_0_1px_0_var(--color-primary-soft)] max-sm:px-3 max-sm:py-2">
              {IconaTitolo && <IconaTitolo className="header-icon size-[1.35rem] pr-2 text-[var(--color-primary)]" />}
              <h6 className="header-title m-0 text-base leading-tight font-extrabold tracking-wide text-[var(--color-primary)] max-sm:text-[0.88rem]">
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

          <div className="box-menu-laterale flex w-full items-center justify-between">
            {menuLaterale && menuLaterale.length > 0 && (
              <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
            )}

            <div className="box-layout-spacer flex-grow" />

            <div className="box-layout-right-button flex items-center gap-2 pr-3">
              <div className="box-layout-theme-lang-group -mr-1 inline-flex items-center gap-0">
                <ThemeToggle placement="header" />
                <Language placement="header" />
              </div>
              {sectionAttiva?.path !== null && !PUBLIC_SECTION_PATHS.has(sectionAttiva.path!) && (
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
            </div>
          </div>
        </div>

        <div className={isVertical ? "box-layout-text-vertical w-full" : "box-layout-text w-full"}>
          {showEmail ? (
            user?.emailUserCurrent ? (
              <FormField
                id="emailFamily"
                label={emailLabel}
                value={user.emailChild ?? ""}
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
              rows={4}
            />
          ) : (
            <FormField
              id="emailFamily"
              label={i18n._("login_simulati_title")}
              value={i18n._("login_simulati")}
              disabled
              readOnly
              multiline
              rows={4}
            />
          )}
        </div>
      </div>

      <div className="layout-alert flex justify-end">
        {alertConfig.open && <Alert onClose={handleClose} message={alertConfig.message} />}
      </div>

      {children}
    </>
  );
};

export default PageLayout;
