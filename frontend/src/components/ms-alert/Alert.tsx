import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { useEffect } from 'react';
import { TypeAlertColor } from '../../general/Constant';

const icons = {
  success: <CheckCircleIcon color="success" />,
  warning: <WarningIcon color="warning" />,
  error: <ErrorIcon color="error" />,
  info: <InfoIcon color="info" />,
};

interface CustomAlertProps {
  message: {
    typeMessage?: TypeAlertColor;
    message?: string[];
  };
  onClose: () => void;
}

const Alert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
 
  useEffect(() => {
    // Automatic close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 2, backgroundColor: '#f9f9f9', boxShadow: 3 }}>
      <Box sx={{ mr: 2 }}>
        {message.typeMessage && icons[message.typeMessage]}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 1 }}>
          {message.typeMessage}
        </Typography>
        {message?.message?.map((msg, index) => (
          <Typography key={index} variant="body2">
            {msg}
          </Typography>
        ))}
      </CardContent>

      <IconButton onClick={onClose} aria-label="close">
        <CloseIcon />
      </IconButton>
    </Card>
  );
};

export default Alert;

