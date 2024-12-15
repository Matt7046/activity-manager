import React, { useEffect, useState } from 'react';
import SubPromiseContent from './SubPromiseContent';
import { ascoltatore } from './SubPromiseFunc';
import subPromiseStore from './store/SubPromiseStore';
import { fetchDataPromise } from './service/SubPromiseService';
import { Grid } from '@mui/material';
import { navigateRouting } from '../../App';
import { useNavigate } from 'react-router-dom';


const SubPromise: React.FC<any> = ({ }) => {


  const navigate = useNavigate(); // Ottieni la funzione di navigazione

  const [rows, setRows] = useState<number>(10); // Stato iniziale vuoto
  const [response, setResponse] = useState<any>({}); // Stato iniziale vuoto

  const [visibiityButton, setVisibilityButton] = useState<boolean>(false); // Stato iniziale vuoto

  // default class SubPromise extends React.Component {

  let hasFetchedData = false;


  useEffect(() => {
    // Questo codice verrà eseguito dopo che il componente è stato montato
    componentDidMount();
    //window.addEventListener('resize', handleResize);

    // Funzione di cleanup (opzionale)
    return () => {

      //window.removeEventListener('resize', handleResize);
    };
  }, []); // Il secondo argomento vuoto ind ica che l'effetto dipenderà solo dal mount

  const componentDidMount = () => {
    if (!hasFetchedData) {
      hasFetchedData = true;
      // Effettua la chiamata GET quando il componente è montato 
      // axios.
      //  .get('https://api.example.com/data') // URL dell'API]
      fetchDataPromise()
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
    subPromiseStore.setAllTesto(response);
    aggiornaDOMComponente(dimension.length, response);

  }



  function navigateToFromAboutPage(): void {
    navigateRouting(navigate, `about`, {})

  }

  return (
    <>
      {Array.from({ length: rows }, (_, rowIndex) => (<SubPromiseContent
        rowIndex={rowIndex}
        key={rowIndex} // Chiave univoca per ogni elemento
        visibiityButton={visibiityButton}
      />
      ))
      }
      <Grid container justifyContent="flex-end" spacing={2}>
        <Grid item>
          <div
            className="col-button-container"
            style={{
              gridColumn: 'span 2', // Unisce le colonne 11 e 12
              display: 'flex', // Utilizza il grid per disporre i pulsanti
              gridTemplateColumns: '2fr 1fr', // Due colonne uguali
              gap: '12px', // Distanza tra i pulsanti
              visibility: visibiityButton ? 'visible' : 'hidden',
            }}
          >
            <div className="col-button">
              <button
                id="button-new"
                className="button-blue"
                title="Nuovo Record"  /* Tooltip nativo */

                onClick={() => navigateToFromAboutPage()} >

                <i className="fas fa-plus" ></i> {/* Icona */}
                {/* Testo accanto all'icona */}
              </button>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
export default SubPromise;



export interface SubPromiseProps {
  nomeProps: string;
  children?: React.ReactNode;  // Aggiungi 'children' opzionale

}

export interface SubPromiseState {
  nome: string; // Definisci lo stato per 'nome'
  testo: string;
}













