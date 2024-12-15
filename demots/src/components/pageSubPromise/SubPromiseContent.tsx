import React, { useState } from "react";
import { observer } from "mobx-react";
import subPromiseStore from "./store/SubPromiseStore";  // Importa lo store
import "./SubPromiseContent.css";
import Label from "../AClabel/label";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { fetchDataPromiseById } from "./service/SubPromiseService";
import NomeDisplay from "../ACnomeDisplay/NomeDisplay";
import handleClick from "../AClabel/labelFunc";
import { ascoltatore } from "./SubPromiseFunc";
import { navigateRouting } from "../../App";
import About from "../pageAbout/About";
import { Alert, Grid, Snackbar } from "@mui/material";



const SubPromiseContent: React.FC<any> = ({
  rowIndex,
  visibiityButton // Proprietà opzionale per la sottolineatura

}) => {
  const navigate = useNavigate(); // Ottieni la funzione di navigazione


  const toggleVisibility = (rowIndex: number, _id: string) => {
    const element = document.querySelector(`#rowHidden-${rowIndex}`) as HTMLElement;
    const check = element.style.visibility === "hidden";
    // Rimuove il valore inline
    if (check) {
      element.style.visibility = ""; // Rimuove il valore inline

    } else {
      element.style.visibility = "hidden"; // Rimuove il valore inline

    }

    if (check) {
      handleClickMostraLabel(rowIndex, _id)
    }
    return check; // Aggiorna lo stato
    ;




  };


  const [labelText] = React.useState('Nessun dato aggiuntivo'); // Stato dinamico per il testo della label

  const handleClickMostraLabel = (rowIndex: number, _id: string) => {

    return fetchDataPromiseById(_id).then((response) => {
      //subPromiseStore.setTesto(rowIndex, response.testo.testo);
      //  setLabelText(subPromiseStore.testo[rowIndex]);
      const subTesto = response.testo.subTesto && response.testo.subTesto !== '' ? response.testo.subTesto : 'Nessun dato aggiuntivo';
      return ascoltatore(subTesto, "label-" + rowIndex.toString())
    })

  }





  function clickRowNome(rowIndex: any): void {
  }



  function openDetail(_id: string): void {
    componentDidMount(_id)

  }



  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [errors, setErrors] = useState('Si è verificato un errore! Controlla i dettagli.')

  const componentDidMount = (_id: string) => {
    // Effettua la chiamata GET quando il componente è montato
    fetchDataPromiseById(_id)
      .then((response) => {
        if (response.status === 'OK') {
          subPromiseStore.setTestoById(_id, response.testo);
          //   ascoltatore(response.testo.nome, "nome")
          //   ascoltatore(response.testo.subTesto, "subTesto")
          navigateRouting(navigate, `about`, { _id })

          console.log('Dati ricevuti:', response);
        } else {
          setErrors(response.errors);
          setOpen(true);
        }
      })
      .catch((error) => {
        console.error('Errore durante il recupero dei dati:', error);
      });
  }

  const valueNome = subPromiseStore.testo[rowIndex] ? subPromiseStore.testo[rowIndex].nome! : '';
  const _id = subPromiseStore.testo[rowIndex] ? subPromiseStore.testo[rowIndex]._id! : '-1';



  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={`row`}>
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
        <div className="col-display">
          <NomeDisplay
            value={valueNome}
            rowIndex={rowIndex}
            handleClick={() => clickRowNome(rowIndex)}
            key={0}
          />
        </div>

        <Grid container justifyContent="flex-end" spacing={2}
          style={{ height: '30px'}} >
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
                  id="button-red"
                  className="button-red"
                  title="Carica sottotesto"  /* Tooltip nativo */

                  onClick={() => toggleVisibility(rowIndex, _id)} >

                  <i className="fas fa-download" ></i> {/* Icona */}
                  {/* Testo accanto all'icona */}
                </button>
              </div>

              <div className="col-button-link">
                <button
                  type="button"
                  className="button-blue"
                  id='button-blue'
                  title="Vai alla pagina dei dettagli"  /* Tooltip nativo */

                  onClick={() => openDetail(_id)}>
                  <i className="fas fa-eye" ></i> {/* Icona */}
                  {/* Testo accanto all'icona */}
                </button>
              </div>
            </div>

          </Grid>

        </Grid>

        <div id={`rowHidden-${rowIndex}`} style={{ gridColumn: 'span 10', visibility: 'hidden' }}  >
          <Label _id={rowIndex} text={labelText} handleClick={() => handleClick()} />
        </div>
        <hr className="custom-separator" /> {/* Stile con classe */}



      </div>

    </>
  );

};





export default SubPromiseContent;
