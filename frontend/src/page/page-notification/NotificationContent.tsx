import FilterListIcon from '@mui/icons-material/FilterList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Box, Collapse, Divider, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import { AlertConfig } from "../../components/ms-alert/Alert";
import { PopoverNotification } from "../../components/ms-popover/Popover";
import { HttpStatus } from "../../general/structure/Constant";
import { getDateStringRegularFormat, NotificationI, ResponseI, UserI } from "../../general/structure/Utils";
import { showMessage } from "../page-home/HomeContent";
import "./NotificationContent.css";
import { getNotificationsByIdentificativo } from "./service/NotificationService";

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
        <DataGrid
          rows={filteredNotifications}
          columns={columns}
          getRowId={(row) => row.id || `${row.dateSender}-${row.message}`}
          rowCount={rowCount}
          loading={loading}
          pageSizeOptions={[5, 10, 20]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="client" // Cambiato a server se la funzione getNotificationsByIdentificativo supporta paginazione
          getRowHeight={() => 'auto'}
          disableColumnMenu
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          sx={{
            border: 'none',
            '& .MuiDataGrid-virtualScroller': { overflowX: 'hidden' }
          }}
        />
        {filteredNotifications.length === 0 && !loading && (
          <Box className="empty-state" sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsActiveIcon className="empty-icon" />
            <Typography variant="h6">Nessun risultato</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

}
export default NotificationContent;
