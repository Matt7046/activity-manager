import { i18n } from "@lingui/core";
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Collapse, Divider, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { AlertConfig } from "../../components/ms-alert/Alert";
import { Pulsante } from "../../components/ms-button/Button";
import DataGridComponent from '../../components/ms-data-grid/DataGrid';
import { PopoverNotification } from "../../components/ms-popover/Popover";
import { ButtonName, HttpStatus, StatusNotification } from "../../general/structure/Constant";
import { getDateStringRegularFormat, NotificationI, ResponseI, UserI } from "../../general/structure/Utils";
import { showMessage } from "../page-home/HomeContent";
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
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const notify: NotificationI[] = [];
  const [popoverNotifications, setPopoverNotifications] = useState<PopoverNotification[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedRowId, setExpandedRowId] = useState<number | string | null>(null);
  const [openLayout, setOpenLayout] = useState(false); // Controlla la visibilità del messaggio  
  const [messageLayout, setMessageLayout] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe

  const handleToggle = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  useEffect(() => {
    fetchNotifications();
    return () => { };
  }, [inizialLoad])

  // Chiamata REST con paginazione
  const fetchNotifications = React.useCallback(() => {
    setLoading(true);
    getNotificationsByIdentificativo(
      user.emailUserCurrent,
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
  }, [user.emailUserCurrent, paginationModel, startDate, endDate]);

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
      headerName: 'Notifiche',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const isExpanded = expandedRowId === params.id;
        const x = params.row as NotificationI;

        return (
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', py: 1, cursor: 'pointer' }}
              onClick={() => setExpandedRowId(isExpanded ? null : params.id)}
            >
              <InfoOutlinedIcon sx={{ mr: 2, color: isExpanded ? '#1976d2' : '#b2bec3' }} />
              <Box sx={{ flexGrow: 1 }}>
                {x.dateSender && (
                  <Typography className="notification-date-badge">
                    {getDateStringRegularFormat(x.dateSender)}
                  </Typography>
                )}
                <Typography className="notification-title">
                  {x.message || "Aggiornamento"}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon
                sx={{
                  transform: isExpanded ? 'rotate(180deg)' : 'none',
                  transition: '0.3s',
                  color: '#666'
                }}
              />
            </Box>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 6, pb: 2, bgcolor: 'inherit' }}>
                <Typography variant="body2" color="text.secondary"><strong>Inviato da:</strong> {x.userSender}</Typography>
                <Divider sx={{ my: 1, opacity: 0.3 }} />
                <Typography variant="body2" color="text.secondary"><strong>Stato:</strong> {x.status}</Typography>
              </Box>
            </Collapse>
          </Box>
        );
      }
    }
  ];

  return (
    <Box className="popover-box">
      {/* SEZIONE FILTRI */}
      <Box className="filter-container">
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
          <FilterListIcon sx={{ fontSize: 18, mr: 1, color: '#1976d2' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Filtra per periodo</Typography>
        </Box>

        <Box className="filter-group">
          <label className="filter-label">Data Inizio</label>
          <input
            type="date"
            className="date-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Box>

        <Box className="filter-group">
          <label className="filter-label">Data Fine</label>
          <input
            type="date"
            className="date-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Box>
      </Box>

      <Box className="grid-container" sx={{ height: 600, width: '100%' }}>
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
