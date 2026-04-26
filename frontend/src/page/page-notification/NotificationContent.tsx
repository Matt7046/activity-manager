import FilterListIcon from '@mui/icons-material/FilterList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Box, Collapse, Divider, Typography } from "@mui/material";
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
  const notify: NotificationI[] = [];
  const [popoverNotifications, setPopoverNotifications] = useState<PopoverNotification[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  useEffect(() => {
    getNotifications(user, alertConfig);
    return () => { };
  }, [inizialLoad])

  const getNotifications = (
    userI: UserI,
    alertConfig: AlertConfig
  ): void => {
    getNotificationsByIdentificativo(
      userI.emailUserCurrent,
      0,
      100,
      () => showMessage(alertConfig.setOpen, alertConfig.setMessage)
    ).then((response: ResponseI | undefined) => {
      if (response?.status === HttpStatus.OK) {
        setNotifications(response.jsonText);
        const popover: PopoverNotification[] = response.jsonText.map((x: NotificationI) => {
          const popoverNotification = {
            message: x.message,
            subText: ['Inviato da: ' + x.userSender, 'data: ' + getDateStringRegularFormat(x.dateSender),
            ' Stato :' + x.status
            ]

          }
          return popoverNotification;

        });
        setPopoverNotifications(popover);
      }
    });
  };
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

     {filteredNotifications.length > 0 ? (
      filteredNotifications.map((x, index) => {
        const isExpanded = expandedIndex === index;
        // Costruiamo i subText al volo o li prendiamo dall'oggetto
        const subTexts = [
          `Inviato da: ${x.userSender}`,
          `Data: ${getDateStringRegularFormat(x.dateSender)}`,
          `Stato: ${x.status}`
        ];

        return (
          <Box key={index} className="notification-item">
            <Box
              className={`notification-header ${isExpanded ? 'is-expanded' : ''}`}
              onClick={() => handleToggle(index)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <InfoOutlinedIcon sx={{ mr: 2, color: isExpanded ? '#1976d2' : '#b2bec3' }} />
                <Box>
                  <Typography className="notification-title">
                    {x.message || "Aggiornamento"}
                  </Typography>
                </Box>
              </Box>
              <Box className="icon-wrapper">
                <KeyboardArrowDownIcon 
                  fontSize="small" 
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} 
                />
              </Box>
            </Box>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box className="notification-details">
                {subTexts.map((text, subIndex) => (
                  <div key={subIndex} className="subtext-item">
                    <Typography className="notification-subtext">{text}</Typography>
                    {subIndex < subTexts.length - 1 && (
                      <Divider sx={{ mt: 1.5, borderColor: '#edf2f7' }} />
                    )}
                  </div>
                ))}
              </Box>
            </Collapse>
          </Box>
        );
      })
      ) : (
        <Box className="empty-state">
          <NotificationsActiveIcon className="empty-icon" />
          <Typography variant="h6" sx={{ color: '#2d3436', fontWeight: 600 }}>
            Nessun risultato
          </Typography>
          <Typography variant="body2" sx={{ color: '#636e72' }}>
            Prova a cambiare le date del filtro o resetta la ricerca.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
export default NotificationContent;
