import { Box, Button as ButtonMui, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { googleLogout } from '@react-oauth/google';
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { navigateRouting } from '../../App';
import Alert from '../../components/ms-alert/Alert';
import Drawer, { MenuLaterale } from '../../components/ms-drawer/Drawer';
import { SectionName, TypeAlertColor } from '../../general/Constant';
import { UserI } from '../../general/Utils';

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
  
   const logout = (): void =>{
    googleLogout();
    navigateRouting(navigate,SectionName.ROOT,{})  
  }

  return (
    <>
      <Box sx={{ paddingLeft: 0.5 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
          <Box sx={{ paddingRight: 2 }}>
          <ButtonMui
            variant="contained"
            color="primary"
            onClick={() => logout()}
            
          >
           Logout
          </ButtonMui>
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

