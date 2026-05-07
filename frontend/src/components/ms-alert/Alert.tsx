"use client";
import { Box, Alert as MuiAlert, Snackbar, Typography } from '@mui/material';
import { useEffect } from 'react';
import { TypeAlertColor } from '../../general/structure/Constant';
import { TypeMessage } from '../../page/page-layout/PageLayout';
import "./Alert.css";

export interface AlertConfig {
  open: boolean;
  message: TypeMessage;
  setOpen: (open: boolean) => void;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>
}

interface CustomAlertProps {
  message: TypeMessage;
  onClose: () => void;
}
const classNameByTypeMessage = (typeMessage: TypeAlertColor | undefined) => {
  switch (typeMessage) {
    case TypeAlertColor.SUCCESS:
      return 'text-up-message-success';
    case TypeAlertColor.ERROR:
      return 'text-up-message-error';
    case TypeAlertColor.INFO:
      return 'text-up-message-info';
    case TypeAlertColor.WARNING:
      return 'text-up-message-warning';
    default:
      return '';
  }
};








const Alert: React.FC<CustomAlertProps> = ({ message, onClose }) => {

  useEffect(() => {
    // Automatic close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [onClose]);

  // message.typeMessage conterrà SUCCESS, ERROR, etc.
  // Lo convertiamo in minuscolo per la prop 'severity' di MUI
  const severity = (message.typeMessage?.toLowerCase() || 'info') as any;

  return (
    <Snackbar
      open={true} // L'apertura è gestita dal padre
      autoHideDuration={4000} // Sparisce dopo 4 secondi
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Posizione in alto a destra
      className="alert-snackbar-custom"
    >
      <MuiAlert
        onClose={onClose}
        severity={severity}
        variant="filled"
        className={`alert-mui-custom alert-shadow-${severity}`}
        iconMapping={{
          // Puoi personalizzare le icone qui se vuoi
        }}
      >
        <Box className="alert-content">
          <Typography className="alert-title-text">
            {message.titleMessage}
              </Typography>
          {message?.message?.map((msg, index) => (
            <Typography key={index} className="alert-body-text">
              {msg}
            </Typography>
          ))}
        </Box>
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;

