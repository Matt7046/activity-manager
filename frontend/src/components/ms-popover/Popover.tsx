import { Box, Popover, Typography } from '@mui/material';
import Button, { Pulsante } from '../ms-button/Button';

import { Divider } from '@mui/material';
import React from 'react';
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
  pulsanteNotification: Pulsante; // Definisci il tipo appropriato per il pulsante
  children?: React.ReactNode // Aggiunto per accettare eventuali figli
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
        horizontal: 'left',
      }}
    >
      <Box className="popover-box">
        {notifications.map((notification, index) => (
          <Box key={index} className="notification-box">
            <Typography variant="body1" className="notification-message">
              {notification.message}
            </Typography>

            <Divider />

            {notification.subText.slice(0, 5).map((subTextOne, index) => (
              <React.Fragment key={index}>
                <Typography variant="body2" className="notification-subtext">
                  {subTextOne}
                </Typography>
                <Divider />
              </React.Fragment>
            ))}
          </Box>
        ))}
        <Box className="button-container">
          <Button pulsanti={[pulsanteNotification]} />
        </Box>
      </Box>
    </Popover>

  );
};

export default PopoverComponent;
