import React, { useEffect, useState } from 'react';
import PointsContent from './PointsContent';
import { getMenuLaterale, UserI } from '../../general/Utils';
import { Alert, Box, Grid, Snackbar } from '@mui/material';
import Drawer from '../../components/msdrawer/Drawer';
import { useNavigate } from 'react-router-dom';

export interface PointsI {
  _id: string | undefined;
  email: string;
  points: number;
  numeroPunti: number;
  attivita: string;
}

const Points: React.FC<{ user: UserI }> = ({ user }) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const menuLaterale = getMenuLaterale(navigate, user);
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const padding = isVertical ? 5 : 8;
  const [errors, setErrors] = React.useState<string[]>([]); // Lo stato è un array di stringhe


  useEffect(() => {

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        <Grid item>
          <Drawer sezioni={menuLaterale} nameMenu='Menu' anchor='left' />
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000} // Chiude automaticamente dopo 6 secondi
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          -{errors}
        </Alert>
      </Snackbar>
      <Box sx={{ paddingLeft: padding, paddingRight: 5 }}>
        <div>
          <PointsContent
            user={user}
            setErrors={setErrors}
          />
        </div>
      </Box>

    </>
  );
};

export default Points;






