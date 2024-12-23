import React, { useEffect, useState } from "react";
import activityStore from "./store/ActivityStore";  // Importa lo store
import "./ActivityContent.css";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchDataActivityById } from "./service/ActivityService";
import { ascoltatore } from "./ActivityFunc";
import { Alert, Grid, Snackbar } from "@mui/material";
import Button, { Pulsante } from "../../components/msbutton/Button";
import NomeDisplay from "../../components/msnomedisplay/NomeDisplay";
import Label from "../../components/mslabel/label";
import { navigateRouting, sezioniMenu, sezioniMenuIniziale, showError } from "../../App";



const ActivityContent: React.FC<any> = ({
  user,
  rowIndex,
  visibiityButton // Proprietà opzionale per la sottolineatura

}) => {
  
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  let menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `activity`, {}, 0);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `about`, {}, 1);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `points`, { email: user.email}, 2);

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

    return fetchDataActivityById(_id , () => showError(setOpen,setErrors)).then((response) => {
      if(response){
      const subTesto = response.testo.subTesto && response.testo.subTesto !== '' ? response.testo.subTesto : 'Nessun dato aggiuntivo';
      return ascoltatore(subTesto, "label-" + rowIndex.toString())
      }
    })

  }

  





  const clickRowNome = (rowIndex: any): void => {
  }



  const openDetail = (_id: string): void => {
    componentDidMount(_id)

  }



  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [errors, setErrors] = useState('Si è verificato un errore! Controlla i dettagli.')

  const componentDidMount = (_id: string) => {
    // Effettua la chiamata GET quando il componente è montato
    fetchDataActivityById(_id,  () =>showError(setOpen,setErrors))
      .then((response) => {
        if (response.status === 'OK') {
          activityStore.setTestoById(_id, response.testo);
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

  const valueNome = activityStore.testo[rowIndex] ? activityStore.testo[rowIndex].nome! : '';
  const _id = activityStore.testo[rowIndex] ? activityStore.testo[rowIndex]._id! : '-1';



  const handleClose = () => {
    setOpen(false);
  };

  const pulsanteRed: Pulsante = {
    icona: 'fas fa-download',
    funzione: () => toggleVisibility(rowIndex, _id), // Passi la funzione direttamente
    nome: 'red',
    title:'Carica sottotesto'
  };
  
  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-eye',
    funzione: () => openDetail(_id), // Passi la funzione direttamente
    nome: 'blue',
    title:'Apri dettaglio'

  };
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);

  useEffect(() => {

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Crea l'array dei pulsanti in base all'orientamento
  const pulsantiVisibili = isVertical ? [pulsanteBlue] : [pulsanteRed, pulsanteBlue]
  const flex = isVertical ? 'flex-start' :'flex-end'

  function handleClick() {
  }

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
        <Grid container justifyContent={flex} spacing={2}
          style={{ height: '30px' }} >
          <Grid item>
            <div>
              <Button visibilityButton={visibiityButton} pulsanti={pulsantiVisibili} />
            </div>
          </Grid>
        </Grid>
        <div id={`rowHidden-${rowIndex}`} style={{ gridColumn: 'span 12', visibility: 'hidden' }}  >
          <Label _id={rowIndex} text={labelText} handleClick={() => handleClick()} />
        </div>
        <hr className="custom-separator" /> {/* Stile con classe */}
      </div>
    </>
  );
};





export default ActivityContent;
