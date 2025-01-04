import { AlertColor, Box, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';
import Alert from '../../components/msallert/Alert';
import Drawer, { MenuLaterale } from '../../components/msdrawer/Drawer';
import { UserI } from '../../general/Utils';


interface PageLayoutProps {
  children: React.ReactNode; // Contenuto specifico della maschera
  menuLaterale: MenuLaterale[][];
  user: UserI;
  open: boolean;
  message: TypeMessage;
  handleClose: () => void;
  padding: number; // Gestione padding dinamico
}
export interface TypeMessage {
  message?: string[];
  typeMessage?: AlertColor;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  user,
  menuLaterale,
  open,
  message,
  handleClose,
  padding,
}) => {
  return (
    <>

      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
      </Grid>

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

