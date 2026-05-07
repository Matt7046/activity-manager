"use client";
import { Trans } from "@lingui/react";
import { Box, Divider, Popover, Typography } from '@mui/material';
import React from 'react';
import Button, { Pulsante } from '../ms-button/Button';
import "./Popover.css";

export interface PopoverNotification {
  message: string | undefined;
  subText: string[];
}

interface PopoverComponentProps {
  notifications: PopoverNotification[];
  openAnchor: boolean;
  anchorEl?: HTMLElement | null;
  handleCloseAnchor: () => void;
  pulsanteNotification: Pulsante;
  children?: React.ReactNode;
}

const PopoverComponent: React.FC<PopoverComponentProps> = ({
  notifications,
  openAnchor,
  anchorEl,
  handleCloseAnchor,
  pulsanteNotification,
}) => {
  return (
    <Popover
      id="popover-notifications"
      className="custom-popover"
      open={openAnchor}
      anchorEl={anchorEl}
      onClose={handleCloseAnchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      elevation={0} // L'ombra è gestita dal CSS
    >
      <Box className="popover-box">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <Box key={index} className="notification-box">
              {/* Titolo della sezione notifiche */}
              <Typography className="notification-message">
                {notification.message || "Notifiche"}
              </Typography>

              {/* Lista dei messaggi */}
              {notification.subText.slice(0, 5).map((subTextOne, subIndex) => (
                <React.Fragment key={subIndex}>
                  <Typography className="notification-subtext">
                    {subTextOne}
                  </Typography>
                  {subIndex < notification.subText.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          ))
        ) : (
          <Box className="notification-empty">
            <Typography className="notification-empty-text">
              <Trans id="nessuna_nuova_notifica" />
            </Typography>
          </Box>
        )}

        {/* Bottone "Vedi tutte" o simile */}
        <Box className="button-container">
          <Button pulsanti={[pulsanteNotification]} />
        </Box>
      </Box>
    </Popover>
  );
};

export default PopoverComponent;