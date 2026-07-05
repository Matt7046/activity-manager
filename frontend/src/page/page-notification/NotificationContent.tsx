"use client";
import { Trans, useLingui } from "@lingui/react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Filter, Info } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AlertConfig } from "../../components/ms-alert/Alert";
import { Pulsante } from "../../components/ms-button/Button";
import DataGridComponent from "../../components/ms-data-grid/DataGrid";
import { ButtonName, HttpStatus, StatusNotification } from "../../general/structure/Constant";
import {
  getDateStringRegularFormat,
  getTranslatedNotification,
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

const NotificationContent: React.FC<NotificationContentProps> = ({ user, alertConfig }) => {
  const [notifications, setNotifications] = useState<NotificationI[]>([]);
  const { i18n } = useLingui();
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);
  void setInitialLoad;
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedRowId, setExpandedRowId] = useState<number | string | null>(null);
  const [openLayout, setOpenLayout] = useState(false);
  const [messageLayout, setMessageLayout] = React.useState<TypeMessage>({});
  void openLayout;
  void messageLayout;

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

  const pulsanteNotification: Pulsante = {
    icona: "fas fa-check-circle",
    funzione: () => saveReadNotification(),
    nome: ButtonName.BLUE,
    title: i18n._("visualizzate"),
    configDialogPulsante: { message: i18n._("vuoi_impostate_le_notifiche_come_lette"), showDialog: true },
  };

  const saveReadNotification = () => {
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
  };

  const filteredNotifications = notifications.filter((notif) => {
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

  const columns: ColumnDef<NotificationI>[] = useMemo(
    () => [
      {
        id: "message",
        header: i18n._("notifiche"),
        cell: ({ row }) => {
          const isExpanded = expandedRowId === row.id;
          const x = row.original;
          const testoKey = getTranslatedNotification(x.message, i18n);

          return (
            <Collapsible
              open={isExpanded}
              onOpenChange={(open) => setExpandedRowId(open ? row.id : null)}
              className="notification-row-cell w-full"
            >
              <CollapsibleTrigger
                className={cn(
                  "notification-row-header flex w-full cursor-pointer items-center py-2",
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
                  {x.dateSender && (
                    <span className="notification-date-badge block text-xs">
                      {getDateStringRegularFormat(x.dateSender)}
                    </span>
                  )}
                  <span className="notification-title block font-medium">{testoKey}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "notification-row-arrow ml-2 size-4 shrink-0 transition-transform",
                    isExpanded && "is-expanded rotate-180"
                  )}
                />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="notification-row-details pb-3 pl-8">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    <strong>
                      <Trans id="inviato_da" />
                    </strong>{" "}
                    {x.userSender}
                  </p>
                  <Separator className="notification-row-divider my-2" />
                  <p className="text-sm text-[var(--color-text-muted)]">
                    <strong>
                      <Trans id="stato" />
                    </strong>{" "}
                    {i18n._(x.status.toLowerCase())}
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        },
      },
    ],
    [expandedRowId, i18n]
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
          rows={filteredNotifications}
          columns={columns}
          loading={loading}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          exportFileName="notifiche"
        />
      </div>
    </div>
  );
};

export default NotificationContent;
