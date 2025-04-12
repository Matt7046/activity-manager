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
      className='popover-prop'
      slotProps={{
        paper: {
          className: 'popover-paper',
        },
      }}

      id="popover-notifications"
      open={openAnchor}
      anchorEl={anchorEl}
      onClose={handleCloseAnchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box sx={{ padding: 2 }}>
        {notifications.map((notification, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <Typography variant="body1" color="text.primary">
              {notification.message}
            </Typography>

            <Divider />

            {notification.subText.slice(0, 5).map((subTextOne, index) => (

              <><Typography variant="body2" color="text.secondary">
                {subTextOne}
              </Typography><Divider /></>

            ))}

          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button pulsanti={[pulsanteNotification]} />
        </Box>
      </Box>
    </Popover>
  );
};

export default PopoverComponent;
