"use client";
import { Trans, useLingui } from "@lingui/react";
import { ColumnDef, ExpandedState, Updater } from "@tanstack/react-table";
import { ChevronDown, Filter, Info } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AlertConfig } from "../../components/ms-alert/Alert";
import { Pulsante } from "../../components/ms-button/Button";
import DataGridComponent, { resolveRowId } from "../../components/ms-data-grid/DataGrid";
import { ButtonName, HttpStatus, StatusNotification } from "../../general/structure/Constant";
import {
  getDateStringRegularFormat,
  getNotificationParts,
  NotificationI,
  ResponseI,
  showMessage,
  UserI,
} from "../../general/structure/Utils";
import { TypeMessage } from "../page-layout/PageLayout";
import "./NotificationContent.css";
import { getNotificationsByIdentificativo, saveNotification } from "./service/NotificationService";

interface NotificationContentProps {
  user: UserI;
  alertConfig: AlertConfig;
  isVertical: boolean;
}

type NotificationRow = NotificationI & { id: string };

const asExpandedRecord = (state: ExpandedState): Record<string, boolean> =>
  state === true ? {} : state;

const handleExpandedChange = (
  current: ExpandedState,
  updater: Updater<ExpandedState>
): ExpandedState => {
  const next = typeof updater === "function" ? updater(current) : updater;

  if (next === true) {
    return next;
  }

  const currentRecord = asExpandedRecord(current);
  const openKeys = Object.keys(next).filter((key) => next[key]);

  if (openKeys.length <= 1) {
    return next;
  }

  const previouslyOpen = Object.keys(currentRecord).filter((key) => currentRecord[key]);
  const newlyOpened = openKeys.find((key) => !previouslyOpen.includes(key));
  const keepKey = newlyOpened ?? openKeys[openKeys.length - 1];

  return { [keepKey]: true };
};

const NotificationContent: React.FC<NotificationContentProps> = ({ user, alertConfig }) => {
  const [notifications, setNotifications] = useState<NotificationI[]>([]);
  const { i18n } = useLingui();
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);
  void setInitialLoad;
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [openLayout, setOpenLayout] = useState(false);
  const [messageLayout, setMessageLayout] = React.useState<TypeMessage>({});
  void openLayout;
  void messageLayout;

  const onExpandedChange = useCallback((updater: Updater<ExpandedState>) => {
    setExpanded((current) => handleExpandedChange(current, updater));
  }, []);

  useEffect(() => {
    fetchNotifications();
    return () => {};
  }, [inizialLoad]);

  const fetchNotifications = React.useCallback(() => {
    setLoading(true);
    getNotificationsByIdentificativo(
      user?.emailUserCurrent,
      paginationModel.page,
      100,
      StatusNotification.ALL,
      () => showMessage(alertConfig.setOpen, alertConfig.setMessage)
    ).then((response: ResponseI | undefined) => {
      if (response?.status === HttpStatus.OK) {
        setNotifications(response.jsonText);
      }
      setLoading(false);
    });
  }, [user?.emailUserCurrent, paginationModel, startDate, endDate]);

  const saveReadNotification = useCallback(() => {
    const notificationsStatusRead = notifications.map((x) => {
      x.status = StatusNotification.READ;
      return x;
    });
    saveNotification(notificationsStatusRead, (messageLayout?: TypeMessage) =>
      showMessage(setOpenLayout, setMessageLayout, messageLayout)
    ).then((response) => {
      if (response?.status === HttpStatus.OK) {
        fetchNotifications();
      }
    });
  }, [notifications, fetchNotifications]);

  const pulsanteNotification: Pulsante = useMemo(
    () => ({
      icona: "fas fa-check-circle",
      funzione: () => saveReadNotification(),
      nome: ButtonName.BLUE,
      title: i18n._("visualizzate"),
      configDialogPulsante: {
        message: i18n._("vuoi_impostate_le_notifiche_come_lette"),
        showDialog: true,
      },
    }),
    [i18n, saveReadNotification]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (!notif.dateSender) return true;
      const notifDate = new Date(notif.dateSender).getTime();
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : -Infinity;
      let end = Infinity;
      if (endDate) {
        const d = new Date(endDate);
        d.setHours(23, 59, 59, 999);
        end = d.getTime();
      }
      return notifDate >= start && notifDate <= end;
    });
  }, [notifications, startDate, endDate]);

  const rows = useMemo(
    () =>
      filteredNotifications.map((item, index) => ({
        ...item,
        id: item._id ?? resolveRowId(item, index),
      })) as NotificationRow[],
    [filteredNotifications]
  );

  const columns: ColumnDef<NotificationRow>[] = useMemo(
    () => [
      {
        id: "message",
        header: i18n._("notifiche"),
        cell: ({ row }) => {
          const isExpanded = row.getIsExpanded();
          const notification = row.original;
          const { title, subText } = getNotificationParts(notification.message, i18n);
          const statusKey = String(notification.status ?? "").toLowerCase();

          return (
            <div className="notification-row-cell w-full">
              <button
                type="button"
                onClick={() => row.toggleExpanded()}
                className={cn(
                  "notification-row-header flex w-full cursor-pointer items-center py-2 text-left",
                  isExpanded && "is-expanded"
                )}
              >
                <Info
                  className={cn(
                    "notification-row-info mr-2 size-4 shrink-0",
                    isExpanded && "is-expanded text-[var(--color-primary-hover)]"
                  )}
                />
                <div className="notification-row-main min-w-0 flex-1">
                  {notification.dateSender && (
                    <span className="notification-date-badge block text-xs">
                      {getDateStringRegularFormat(notification.dateSender)}
                    </span>
                  )}
                  <span className="notification-title block font-medium">{title}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "notification-row-arrow ml-2 size-4 shrink-0 transition-transform",
                    isExpanded && "is-expanded rotate-180"
                  )}
                />
              </button>

              {isExpanded ? (
                <div className="notification-row-details pb-3 pl-8">
                  {subText ? (
                    <>
                      <p className="text-sm text-[var(--color-text-muted)]">{subText}</p>
                      <Separator className="notification-row-divider my-2" />
                    </>
                  ) : null}
                  <p className="text-sm text-[var(--color-text-muted)]">
                    <strong>
                      <Trans id="inviato_da" />
                    </strong>{" "}
                    {notification.userSender}
                  </p>
                  <Separator className="notification-row-divider my-2" />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    <strong>
                      <Trans id="stato" />
                    </strong>{" "}
                    {statusKey ? i18n._(statusKey) : notification.status}
                  </p>
                </div>
              ) : null}
            </div>
          );
        },
      },
    ],
    [i18n]
  );

  return (
    <div className="notification-container">
      <Accordion className="notification-filter-accordion">
        <AccordionItem value="filters">
          <AccordionTrigger className="notification-filter-summary px-4">
            <div className="notification-filter-header flex items-center gap-2">
              <Filter className="notification-filter-icon size-4" />
              <span className="notification-filter-title text-sm font-semibold">
                <Trans id="filtra_periodo" />
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="notification-filter-details px-4">
            <div className="notification-filter-container flex flex-wrap gap-4">
              <div className="notification-filter-group space-y-1">
                <label className="notification-filter-label text-sm font-medium">
                  <Trans id="data_inizio" />
                </label>
                <input
                  type="date"
                  className="notification-date-input rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="notification-filter-group space-y-1">
                <label className="notification-filter-label text-sm font-medium">
                  <Trans id="data_fine" />
                </label>
                <input
                  type="date"
                  className="notification-date-input rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="notification-grid-container">
        <DataGridComponent
          pulsanti={[pulsanteNotification]}
          rows={rows}
          columns={columns}
          loading={loading}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          exportFileName="notifiche"
          enableExpanding
          expanded={expanded}
          onExpandedChange={onExpandedChange}
        />
      </div>
    </div>
  );
};

export default NotificationContent;
