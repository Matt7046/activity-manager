import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect } from 'react';
import { TypeAlertColor } from '../../general/structure/Constant';
import "./Alert.css";

const icons = {

  SUCCESS: <CheckCircleIcon color="success" />,
  WARNING: <WarningIcon color="warning" />,
  ERROR: <ErrorIcon color="error" />,
  INFO: <InfoIcon color="info" />,
};

interface CustomAlertProps {
  message: {
    typeMessage?: TypeAlertColor;
    message?: string[];
  };
  onClose: () => void;
}
const classNameByTypeMessage = (typeMessage: TypeAlertColor|undefined) => {
  switch(typeMessage) {
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





  return (
    <Card className={message.typeMessage ? "card-alert-success" : "card-alert-error"}   >

      <CardContent className='card-content'>
        <Grid container justifyContent="space-between" spacing={2}>
          <Box className ='box-alert'>
            {message.typeMessage && icons[message.typeMessage]}
          </Box>
          <Typography
            variant="h6"
            className={classNameByTypeMessage(message.typeMessage)}        >
            {message.typeMessage}
          </Typography>
          <Grid>
            <IconButton onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        {message?.message?.map((msg, index) => (
          <Typography
          className='text-message'
            key={index}
            variant="body2"         
          >
            {msg}
          </Typography>
        ))}
      </CardContent>


    </Card>
  );
};

export default Alert;

