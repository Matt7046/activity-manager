import { Box, Button as ButtonMui, Divider, Popover, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { googleLogout } from '@react-oauth/google';
import React, { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { navigateRouting } from '../../App';
import Alert from '../../components/ms-alert/Alert';
import Drawer, { MenuLaterale } from '../../components/ms-drawer/Drawer';
import { SectionName, TypeAlertColor } from '../../general/Constant';
import { NotificationI, ResponseI, UserI } from '../../general/Utils';
import { getNotificationsByIdentificativo } from '../page-notification/service/NotificationService';

interface PageLayoutProps {
  children: React.ReactNode; // Contenuto specifico della maschera
  menuLaterale: MenuLaterale[][];
  user: UserI;
  open: boolean;
  message: TypeMessage;
  handleClose: () => void;
  navigate: NavigateFunction; // Gestione padding dinamico
}
export interface TypeMessage {
  message?: string[];
  typeMessage?: TypeAlertColor;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  user,
  menuLaterale,
  open,
  message,
  handleClose,
  navigate,
}) => {

  const logout = (): void => {
    googleLogout();
    navigateRouting(navigate, SectionName.ROOT, {})
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openAnchor, setOpenAnchor] = useState(false);
  const notify : NotificationI[] = [];
  const [notifications, setNotifications] = useState(notify);

  const handleClickAnchor = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Imposta il target del popover
    getNotificationsByIdentificativo(user.emailUserCurrent,0 , 5).then((response: ResponseI) => {
      setNotifications(response.jsonText);
      setOpenAnchor(true); // Mostra il popover
    })

  };

  // Funzione per chiudere il popover
  const handleCloseAnchor = () => {
    setOpenAnchor(false); // Nasconde il popover
  };


  const id = 'simple-popover';

  return (
    <>
      <Box sx={{ paddingLeft: 0.5 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
          <Box sx={{ paddingRight: 2, display: 'flex', gap: 2 }}>
            <ButtonMui
              variant="contained"
              color="primary"
              onClick={handleClickAnchor}            >
              Notifiche
            </ButtonMui>
            <ButtonMui
              variant="contained"
              color="primary"
              onClick={() => logout()}
            >
              Logout
            </ButtonMui>
            {/* Area notifica */}
            <Popover
              id={id}
              open={openAnchor}
              anchorEl={anchorEl}
              onClose={handleCloseAnchor}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {/* Contenuto del popover */}
              <Box sx={{ padding: 2 }}>
                {notifications.map((notification, index) => (
                  <Box key={index} sx={{ marginBottom: 2 }}>
                    {/* Prima riga: messaggio */}
                    <Typography variant="body1" color="text.primary">
                      {notification.message}
                    </Typography>

                    {/* Separatore */}
                    <Divider sx={{ my: 1 }} />

                    {/* Seconda riga: inviato da */}
                    <Typography variant="body2" color="text.secondary">
                      Inviato da: {notification.userSender}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Popover>
          </Box>
        </Grid>
      </Box>
      {/* Mostra l'alert se open è true */}
      {open && (
        <Alert onClose={handleClose} message={message} />
      )}

      <div className="row">
        <Box sx={{ padding: 2 }}>
          <div id="text-box-email">
            <TextField
              id="emailFamily"
              label='Child Email'
              variant="standard"
              value={user.emailFamily} // Collega il valore allo stato
              // onChange={handleChangeEmailFamily} // Aggiorna lo stato quando cambia
              fullWidth
              disabled={true} />
          </div>
        </Box>

      </div>
      {children}

    </>
  );
}

export default PageLayout;


