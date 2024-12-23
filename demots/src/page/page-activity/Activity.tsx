import React, { useEffect, useState } from 'react';
import ActivityContent from './ActivityContent';
import { ascoltatore } from './ActivityFunc';
import activityStore from './store/ActivityStore';
import { fetchDataActivity } from './service/ActivityService';
import { Box, Grid, Menu } from '@mui/material';
import { navigateRouting, sezioniMenu, sezioniMenuIniziale } from '../../App';
import { useNavigate } from 'react-router-dom';
import Button, { Pulsante } from '../../components/msbutton/Button';
import Drawer from '../../components/msdrawer/Drawer';


const Activity: React.FC<{ user: any }> = ({ user }) => {

  const [utente, setUtente] = useState<any>(user); // Stato iniziale vuoto

  const navigate = useNavigate(); // Ottieni la funzione di navigazione

  const [rows, setRows] = useState<number>(10); // Stato iniziale vuoto
  const [response, setResponse] = useState<any>({}); // Stato iniziale vuoto

  const [visibiityButton, setVisibilityButton] = useState<boolean>(false); // Stato iniziale vuoto


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
  const paddingType = isVertical ? 5   :8;

  const componentDidMount = () => {
    if (!hasFetchedData) {
      hasFetchedData = true;
      // Effettua la chiamata GET quando il componente è montato 
      // axios.
      //  .get('https://api.example.com/data') // URL dell'API]
      fetchDataActivity()
        .then((response) => {
          if (response) {
            setResponse(response)
            const rows = Array.from({ length: response.testo.length }, (_, i) => i + 1); // Genera un array dinamico
            setRows(response.testo.length);
            caricamentoIniziale(response, rows);
          }

        })
        .catch((error) => {
          console.error('Errore durante il recupero dei dati:', error);
        });
    }
  }


  const aggiornaDOMComponente = (dimension: number, responseNome: string[]): any => {
    if (responseNome) {
      for (let index = 0; index < responseNome.length; index++) {
        if (dimension !== 0)
          ascoltatore(responseNome[index], "displayer-" + index.toString());
      }
      setVisibilityButton(true);
    }
  }




  const caricamentoIniziale = (response: any, rows: number[]): any => {
    // const nome = response.testo.map((x: { nome: any; }) => x.nome);
    return setAllTesto(response, rows)
  }



  const setAllTesto = (response: any, dimension: number[]) => {
    activityStore.setAllTesto(response);
    aggiornaDOMComponente(dimension.length, response);

  }



  const navigateToFromAboutPage = (): void => {
    navigateRouting(navigate, `about`, {})

  }

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-plus',
    funzione: () => navigateToFromAboutPage(), // Passi la funzione direttamente
    nome: 'blue',
    title: 'Nuovo documento'

  };

  let menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `activity`, {}, 0);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `about`, {}, 1);




  return (
    <>


      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        <Grid item>
          <Drawer sezioni={menuLaterale} nameMenu='Menu' anchor='left'  />
        </Grid>
      </Grid>
      <Box sx={{ paddingLeft:paddingType, paddingRight: 5 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Button pulsanti={[pulsanteBlue]} />
          </Grid>
        </Grid>
        <div>
          {Array.from({ length: rows }, (_, rowIndex) => (<ActivityContent
            user={utente}
            rowIndex={rowIndex}
            visibiityButton={visibiityButton}
          />
          ))
          }
        </div>
      </Box>
    </>
  );
}
export default Activity;



export interface ActivityProps {
  nomeProps: string;
  children?: React.ReactNode;  // Aggiungi 'children' opzionale

}

export interface ActivityState {
  nome: string; // Definisci lo stato per 'nome'
  testo: string;
}













