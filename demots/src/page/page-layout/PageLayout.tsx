import React from 'react';
import { Grid, Snackbar, Alert, Box } from '@mui/material';
import Drawer, { MenuLaterale } from '../../components/msdrawer/Drawer';

interface PageLayoutProps {
  children: React.ReactNode; // Contenuto specifico della maschera
  menuLaterale:MenuLaterale[][]; 
  open: boolean;
  errors: string[];
  handleClose: () => void;
  padding: number; // Gestione padding dinamico
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  menuLaterale,
  open,
  errors,
  handleClose,
  padding,
}) => {
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        <Grid item>
          <Drawer sezioni={menuLaterale} nameMenu="Menu" anchor="left" />
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errors}
        </Alert>
      </Snackbar>
      <Box sx={{ paddingLeft: padding, paddingRight: 5 }}>{children}</Box>
    </>
  );
};

export default PageLayout;
