import { Alert, Grid, Snackbar } from '@mui/material';
import { observer } from 'mobx-react';
import NameDisplay from '../msnamedisplay/NameDisplay';
import Label from '../mslabel/label';
import Button, { Pulsante } from '../msbutton/Button';
import { myDisplayer } from '../../general/Utils';
import React from 'react';
import { fetchDataActivityById } from '../../page/page-activity/service/ActivityService';
import { showError } from '../../App';


export interface MsSchedule {

  justifyContent?: string;
  onClose: any;
  handleClose: any;
  schedule: { _id: string; nome: string; subtesto: string }[]; // Migliorata la tipizzazione
  errors: any;
  visibilityButton: boolean;
  open: any;
  pulsanti: Pulsante[];
}


const Schedule = observer((props: {
  schedule: MsSchedule
}) => {
  const visibilityButton = props.schedule.visibilityButton ?? true;

  let pulsanteNew = props.schedule.pulsanti.find(
    (pulsante) => pulsante.nome.toUpperCase() === 'NEW'
  )!;
  pulsanteNew = pulsanteNew ?? {} as Pulsante;

  return (
    <>
      <div className="row">
        {/* Snackbar per messaggi */}
        <Snackbar
          open={props.schedule.open}
          autoHideDuration={6000} // Chiude automaticamente dopo 6 secondi
          onClose={props.schedule.handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posizione del messaggio
        >
          <Alert onClose={props.schedule.onClose} severity="error" sx={{ width: '100%' }}>
            -{props.schedule.errors}
          </Alert>
        </Snackbar>
      
      {/* Pulsante "NEW" solo una volta all'inizio */}
      {props.schedule.pulsanti.filter(
        (pulsante) => pulsante.nome.toUpperCase() === 'NEW'
      ).map((pulsante) => (
        <Grid container justifyContent="space-between" alignItems="center" spacing={2} key="newButton">
          <Grid item>
            <Button
              pulsanti={[
                {
                  ...pulsante,
                  funzione: (_id: string) => {
                    pulsante.funzione(); // Funzione dinamica per l'ID
                  },
                  callBackEnd: (_id: string) => {
                    pulsante.callBackEnd(); // Funzione dinamica per callBackEnd
                  },
                },
              ]}
            />
          </Grid>
        </Grid>
      ))}
  
        {/* Iterazione sui dati dello schedule */}
        {props.schedule.schedule.map((item, rowIndex) => {
          // Creazione dei pulsanti "RED"
          const pulsanteWithFunctionRED = props.schedule.pulsanti
            .filter((pulsante) => pulsante.nome.toUpperCase() === 'RED')
            .map((pulsante) => ({
              ...pulsante, // Copia tutte le altre proprietà del pulsante
              funzione: (_id: string) => {
                // La funzione viene definita dinamicamente con l'ID
                toggleVisibility(item._id, pulsante);
              },
              callBackEnd: (_id: string) => {
                // La funzione viene definita dinamicamente con l'ID
                pulsante.callBackEnd(item._id);
              },
              visibility: !props.schedule.visibilityButton
            }));
  
          // Creazione degli altri pulsanti
          const pulsanteWithFunctionOther = props.schedule.pulsanti
            .filter(
              (pulsante) =>
                pulsante.nome.toUpperCase() !== 'RED' && pulsante.nome.toUpperCase() !== 'NEW'
            )
            .map((pulsante) => ({
              ...pulsante, // Copia tutte le altre proprietà del pulsante
              funzione: (_id: string) => {
                // La funzione viene definita dinamicamente con l'ID
                pulsante.funzione(item._id); // Passiamo item._id
              },
              callBackEnd: (_id: string) => {
                // La funzione viene definita dinamicamente con l'ID
                pulsante.callBackEnd(item._id); // Passiamo item._id
              },
              visibility: true
            }));
  
          // Uniamo i pulsanti "RED" e gli altri
          const pulsanti = [
            ...pulsanteWithFunctionRED,
            ...pulsanteWithFunctionOther,
          ];
  
          return (
            <React.Fragment key={item._id}>   
  
              <div className="col-display">
                <NameDisplay value={item.nome} identificativo={item._id} />
              </div>
  
              <Grid container justifyContent={props.schedule.justifyContent} spacing={2} style={{ height: '30px' }}>
                <Grid item>
                  <div>
                    <Button  pulsanti={pulsanti} />
                  </div>
                </Grid>
              </Grid>
  
              <div id={`rowHidden-${item._id}`} style={{ gridColumn: 'span 12', visibility: 'hidden' }}>
                <Label _id={item._id} text={item.subtesto} />
              </div>
  
              {/* Separatore */}
              <hr className="custom-separator" />
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
})

export const toggleVisibility = (_id: string, pulsante: Pulsante) => {
  const element = document.querySelector(`#rowHidden-${_id}`) as HTMLElement;
  const check = element.style.visibility === "hidden";
  // Rimuove il valore inline
  if (check) {
    element.style.visibility = ""; // Rimuove il valore inline

  } else {
    element.style.visibility = "hidden"; // Rimuove il valore inline

  }

  if (check && pulsante.callBackEnd) {

    pulsante.callBackEnd(_id).then((response: { testo: { subTesto: string; }; }) => {
      if (response && pulsante.nome.toUpperCase() === "RED") {
        const subTesto = response.testo.subTesto && response.testo.subTesto !== '' ? response.testo.subTesto : 'Nessun dato aggiuntivo';
        return myDisplayer("label-" + _id, subTesto)
      }
    })
  }
  return check; // Aggiorna lo stato
};

export const aggiornaDOMComponente = (responseNome: any[], setVisibilityButton: any): any => {
  if (responseNome) {
    for (let index = 0; index < responseNome.length; index++) {
      myDisplayer("displayer-" + responseNome[index]._id, responseNome[index].nome);
      setVisibilityButton(true);
    }
  }
};

export default Schedule;