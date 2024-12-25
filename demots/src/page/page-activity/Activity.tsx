import React, { useEffect, useState } from 'react';
import ActivityContent from './ActivityContent';
import activityStore from './store/ActivityStore';
import { fetchDataActivity } from './service/ActivityService';
import { Box, Grid } from '@mui/material';
import { sezioniMenu, sezioniMenuIniziale } from '../../App';
import { useNavigate } from 'react-router-dom';
import Drawer from '../../components/msdrawer/Drawer';
import { aggiornaDOMComponente } from '../../components/msschedule/Schedule';
import { ResponseI, UserI } from '../../general/Utils';

export interface ActivityI {
  _id: string | undefined;
  nome: string;
  subTesto: string;
}

const Activity: React.FC<{ user: UserI }> = ({ user }) => {

  const [utente, setUtente] = useState<UserI>(user); // Stato iniziale vuoto
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const [response, setResponse] = useState<any>([]); // Stato iniziale vuoto
  const [visibilityButton, setVisibilityButton] = useState<boolean>(false); // Stato iniziale vuoto


  // default class Activity extends React.Component {

  let hasFetchedData = false;
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);


  useEffect(() => {
    // Questo codice verrà eseguito dopo che il componente è stato montato
    componentDidMount();
    //window.addEventListener('resize', handleResize);

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Il secondo argomento vuoto ind ica che l'effetto dipenderà solo dal mount
  const paddingType = isVertical ? 5 : 8;

  const componentDidMount = () => {
    if (!hasFetchedData) {
      hasFetchedData = true;
      // Effettua la chiamata GET quando il componente è montato 
      // axios.
      //  .get('https://api.example.com/data') // URL dell'API]
      fetchDataActivity()
        .then((response) => {
          if (response) {
            setResponse(response.testo)
            caricamentoIniziale(response);
          }
        })
        .catch((error) => {
          console.error('Errore durante il recupero dei dati:', error);
        });
    }
  }

  const caricamentoIniziale = (response: ResponseI): void => {
    return setAllTesto(response);
  }

  const setAllTesto = (response: ResponseI): void=> {
    activityStore.setAllTesto(response);
    aggiornaDOMComponente(response.testo, () => setVisibilityButton(true));
  }

  let menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `activity`, {}, 0);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `about`, {}, 1);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        <Grid item>
          <Drawer sezioni={menuLaterale} nameMenu='Menu' anchor='left' />
        </Grid>
      </Grid>
      <Box sx={{ paddingLeft: paddingType, paddingRight: 5 }}>
        <div>
          <ActivityContent
            responseSchedule={response}
            user={utente}
          />
        </div>
      </Box>
    </>
  );
}
export default Activity;
