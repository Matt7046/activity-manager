import { AlertColor, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';
import Alert from '../../components/msallert/Alert';
import Drawer, { MenuLaterale } from '../../components/msdrawer/Drawer';


interface PageLayoutProps {
  children: React.ReactNode; // Contenuto specifico della maschera
  menuLaterale: MenuLaterale[][];
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

      <Box sx={{ paddingLeft: padding }}>
        {children}
      </Box>
    </>
  );
}

export default PageLayout;

