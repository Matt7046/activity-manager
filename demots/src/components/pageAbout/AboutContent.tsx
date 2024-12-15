import React, { useState } from "react";
import "./About.css";
import Label from "../AClabel/label";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import subPromiseStore from "../pageSubPromise/store/SubPromiseStore";
import { navigateRouting } from "../../App";
import TextField from '@mui/material/TextField';
import { Alert, Grid, Hidden, Snackbar } from "@mui/material";
import { deleteAboutById, saveAboutById } from "./service/AboutService";
import { DTOSubPromise } from "../dto/DTOSubPromise";



const AboutContent: React.FC<any> = ({
}) => {



  const location = useLocation();
  const { _id } = location.state || {}; // Ottieni il valore dallo stato

  const navigate = useNavigate(); // Ottieni la funzione di navigazione

  let testoOld = subPromiseStore.testo.find((x) => _id === x._id);
  testoOld = testoOld ? testoOld : new DTOSubPromise();
  const [nome, setNome] = useState(subPromiseStore.testo.find((x) => _id === x._id)?.nome);

  const handleChangeNome = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value); // Aggiorna lo stato con il valore inserito
  };

  const [subTesto, setSubTesto] = useState(subPromiseStore.testo.find((x) => _id === x._id)?.subTesto);

  const handleChangeSubTesto = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubTesto(event.target.value); // Aggiorna lo stato con il valore inserito
  };

  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [errors, setErrors] = useState('Si è verificato un errore! Controlla i dettagli.')



  const navigateRoutingWithResetStore = (navigate: NavigateFunction, _id?: string) => {

    // subPromiseStore.setAllTesto([]);
    //  subPromiseStore.setTestoById(+_id!, '');
    //   ascoltatore(response.testo.nome, "nome")
    //   ascoltatore(response.testo.subTesto, "subTesto")
    navigateRouting(navigate, '', {})
  }



  function cancellaRecord(_id: any): void {

    deleteAboutById(_id).then((response) => {
      if (response.status === 'OK') {
        navigateRoutingWithResetStore(navigate, _id)
        console.log('Dati ricevuti:', response);
      } else {
        setErrors(response.errors);
        setOpen(true);
      }
    })
  }

  const handleClose = () => {
    setOpen(false);
  };




  function salvaRecord(_id: string): void {

    const testo = {
      _id: _id,
      nome: nome,
      subTesto: subTesto
    }
    saveAboutById(_id, testo).then((response) => {
      if (response.testo) {
        navigateRoutingWithResetStore(navigate, _id)
      }
    })
  }

  return (
    <>
      <div>
        <Snackbar
          open={open}
          autoHideDuration={6000} // Chiude automaticamente dopo 6 secondi
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posizione del messaggio
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            -{errors}
          </Alert>
        </Snackbar>
        <div id={`returnHome`} style={{ gridColumn: 'span 12', textAlign: 'left',  paddingBottom: '50px' }}  >
          <Label text='home' handleClick={() => navigateRoutingWithResetStore(navigate, _id)} _id='0' isUnderlined={true} />
        </div>

        <div id={'text-box'} style={{ paddingLeft: '15px' }} >
          <TextField id="nome" label={testoOld.nome} variant="standard" value={nome} // Collega il valore allo stato
            onChange={handleChangeNome} // Aggiorna lo stato quando cambia
          />
        </div>
        <div id={'text-box-sub-testo'} style={{ paddingLeft: '15px', width: 'calc(100% - 50px)' }} >
          <TextField id="subTesto" label={testoOld.subTesto} variant="standard" value={subTesto} // Collega il valore allo stato
            onChange={handleChangeSubTesto} // Aggiorna lo stato quando cambia
            fullWidth
            multiline
            rows={10}  // Numero di righe visibili per il campo
            InputLabelProps={{
              style: {
                whiteSpace: 'normal', // Permette al testo di andare a capo
                wordWrap: 'break-word', // Interrompe le parole lunghe
              }
            }}
          />
        </div>


        <Grid container justifyContent="flex-end" spacing={2} style={{ paddingTop : '17px' }}>
          <Grid item>
            <div
              className="col-button-container-top"
              style={{
                gridColumn: 'span 2', // Unisce le colonne 11 e 12
                display: 'flex', // Utilizza il grid per disporre i pulsanti
                gridTemplateColumns: '2fr 1fr', // Due colonne uguali
                gap: '12px', // Distanza tra i pulsanti

              }}
            >
              <div className="col-button" style={{ visibility: _id ? 'visible' : 'hidden' }}>
                <button
                  id="button-red"
                  className="button-red"
                  title="Elimina"  /* Tooltip nativo */

                  onClick={() => cancellaRecord(_id)} >

                  <i className="fas fa-solid fa-trash" ></i> {/* Icona */}
                  {/* Testo accanto all'icona */}
                </button>
              </div>

              <div className="col-button-link">
                <button
                  type="button"
                  className="button-blue"
                  id='button-blue'
                  title="Salva"  /* Tooltip nativo */

                  onClick={() => salvaRecord(_id)}>
                  <i className="fas fa-solid fa-floppy-disk" ></i> {/* Icona */}
                  {/* Testo accanto all'icona */}
                </button>
              </div>
            </div>

          </Grid>

        </Grid>

      </div>
    </>
  );
};



// Componente che visualizza il testo dallo store


export default AboutContent;
