"use client";
import { Trans, useLingui } from "@lingui/react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Accordion, AccordionDetails, AccordionSummary, Box, Collapse, Divider, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { AlertConfig } from "../../components/ms-alert/Alert";
import { Pulsante } from "../../components/ms-button/Button";
import DataGridComponent from '../../components/ms-data-grid/DataGrid';
import { ButtonName, HttpStatus, StatusNotification } from "../../general/structure/Constant";
import { getDateStringRegularFormat, getTranslatedNotification, NotificationI, ResponseI, showMessage, UserI } from "../../general/structure/Utils";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedRowId, setExpandedRowId] = useState<number | string | null>(null);
  const [openLayout, setOpenLayout] = useState(false); // Controlla la visibilità del messaggio  
  const [messageLayout, setMessageLayout] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe

  useEffect(() => {
    fetchNotifications();
    return () => { };
  }, [inizialLoad])

  // Chiamata REST con paginazione
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
        // Assumendo che il server restituisca anche il totale record per la paginazione virtuale
        setNotifications(response.jsonText);
        setRowCount(response.jsonText.length);
      }
      setLoading(false);
    });
  }, [user?.emailUserCurrent, paginationModel, startDate, endDate]);

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
      x.status = StatusNotification.READ;
      return x;
    });
    saveNotification(notificationsStatusRead, (messageLayout?: TypeMessage) => showMessage(setOpenLayout, setMessageLayout, messageLayout)).then((response) => {
      if (response) {
        if (response.status === HttpStatus.OK) {
          // REFRESH DELLA GRIGLIA
          fetchNotifications();
        }
      }
    })
  }
  // Logica di filtraggio corretta
  const filteredNotifications = notifications.filter(notif => {
    if (!notif.dateSender) return true;

    // Trasformiamo la data della notifica in timestamp
    const notifDate = new Date(notif.dateSender).getTime();

    // Data inizio: impostiamo alle 00:00:00
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : -Infinity;

    // Data fine: impostiamo alle 23:59:59 per includere l'intera giornata
    let end = Infinity;
    if (endDate) {
      const d = new Date(endDate);
      d.setHours(23, 59, 59, 999);
      end = d.getTime();
    }

    return notifDate >= start && notifDate <= end;
  });
  // Definizione colonne UNICA (fuori dal render per performance)

  const columns: GridColDef[] = [
    {
      field: 'message',
      headerName: i18n._("notifiche"),
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const isExpanded = expandedRowId === params.id;
        const x = params.row as NotificationI;
        const testoKey = getTranslatedNotification(x.message, i18n)

        return (
          <Box className="notification-row-cell">
            <Box
              className={`notification-row-header ${isExpanded ? 'is-expanded' : ''}`}
              onClick={() => setExpandedRowId(isExpanded ? null : params.id)}
            >
              <InfoOutlinedIcon className={`notification-row-info ${isExpanded ? 'is-expanded' : ''}`} />
              <Box className="notification-row-main">
                {x.dateSender && (
                  <Typography className="notification-date-badge">
                    {getDateStringRegularFormat(x.dateSender)}
                  </Typography>
                )}
                <Typography className="notification-title">
                  {testoKey}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon
                className={`notification-row-arrow ${isExpanded ? 'is-expanded' : ''}`}
              />
            </Box>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box className="notification-row-details">
                <Typography variant="body2" color="text.secondary"><strong><Trans id="inviato_da" /></strong> {x.userSender}</Typography>
                <Divider className="notification-row-divider" />
                <Typography variant="body2" color="text.secondary"><strong><Trans id="stato" /></strong> {i18n._(x.status.toLowerCase())}</Typography>
              </Box>
            </Collapse>
          </Box>
        );
      }
    }
  ];

  return (
    <Box className="notification-container">
      {/* SEZIONE FILTRI */}
      <Accordion className="notification-filter-accordion" disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className="notification-filter-expand-icon" />}
          className="notification-filter-summary"
        >
          <Box className="notification-filter-header">
            <FilterListIcon className="notification-filter-icon" />
            <Typography variant="subtitle2" className="notification-filter-title"><Trans id="filtra_periodo" /></Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails className="notification-filter-details">
          <Box className="notification-filter-container">
            <Box className="notification-filter-group">
              <label className="notification-filter-label"><Trans id="data_inizio" /></label>
              <input
                type="date"
                className="notification-date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Box>

            <Box className="notification-filter-group">
              <label className="notification-filter-label"><Trans id="data_fine" /></label>
              <input
                type="date"
                className="notification-date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box className="notification-grid-container">
        <DataGridComponent
          pulsanti={[pulsanteNotification]} // Se vuoi aggiungere pulsanti specifici per la toolbar, passali qui
          rows={filteredNotifications}
          columns={columns}
          rowCount={rowCount}
          loading={loading}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Box>
    </Box>
  );

}
export default NotificationContent;
