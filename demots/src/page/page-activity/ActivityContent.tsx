import React, { useEffect, useState } from "react";
import activityStore from "./store/ActivityStore";  // Importa lo store
import "./ActivityContent.css";
import { useNavigate } from "react-router-dom";
import { fetchDataActivityById } from "./service/ActivityService";
import { ascoltatore } from "./ActivityFunc";
import { navigateRouting, sezioniMenu, sezioniMenuIniziale, showError } from "../../App";
import { Pulsante } from "../../components/msbutton/Button";
import Schedule from "../../components/msschedule/Schedule";



const ActivityContent: React.FC<any> = ({
  user,
  identificativo,
  visibiityButton // Proprietà opzionale per la sottolineatura

}) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  let menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `activity`, {}, 0);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `about`, {}, 1);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `points`, { email: user.email }, 2);

  const toggleVisibility = (_id: string) => {
    const element = document.querySelector(`#rowHidden-${_id}`) as HTMLElement;
    const check = element.style.visibility === "hidden";
    // Rimuove il valore inline
    if (check) {
      element.style.visibility = ""; // Rimuove il valore inline

    } else {
      element.style.visibility = "hidden"; // Rimuove il valore inline

    }

    if (check) {
      handleClickMostraLabel(_id)
    }
    return check; // Aggiorna lo stato
  };

  const [labelText] = React.useState('Nessun dato aggiuntivo'); // Stato dinamico per il testo della label

  const handleClickMostraLabel = ( _id: string) => {

    return fetchDataActivityById(_id, () => showError(setOpen, setErrors)).then((response) => {
      if (response) {
        const subTesto = response.testo.subTesto && response.testo.subTesto !== '' ? response.testo.subTesto : 'Nessun dato aggiuntivo';
        return ascoltatore(subTesto, "label-" + _id)
      }
    })
  }

  const openDetail = (_id: string): void => {
    componentDidMount(_id)
  }

  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [errors, setErrors] = useState('Si è verificato un errore! Controlla i dettagli.')

  const componentDidMount = (_id: string) => {
    // Effettua la chiamata GET quando il componente è montato
    fetchDataActivityById(_id, () => showError(setOpen, setErrors))
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

  const titleLabel = activityStore.testo.find(item => item._id === identificativo)?.nome || '';



  const handleClose = () => {
    setOpen(false);
  };

  const pulsanteRed: Pulsante = {
    icona: 'fas fa-download',
    funzione: () => toggleVisibility(identificativo), // Passi la funzione direttamente
    nome: 'red',
    title: 'Carica sottotesto'
  };

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-eye',
    funzione: () => openDetail(identificativo), // Passi la funzione direttamente
    nome: 'blue',
    title: 'Apri dettaglio'

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
  const flex = isVertical ? 'flex-start' : 'flex-end'
 
  return (
    <>
      <div id="schedlule">
        <Schedule justifyContent={flex} onClose={onclose} handleClose={handleClose} identificativo={identificativo} 
        titleLabel={titleLabel} subTitleLabel={labelText} errors={errors} visibilityButton={visibiityButton}
         open={open} pulsanti={pulsantiVisibili} />
      </div>
    </>
  );
};





export default ActivityContent;
