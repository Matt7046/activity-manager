import React, { useEffect, useState } from "react";
import activityStore from "./store/ActivityStore";  // Importa lo store
import "./ActivityContent.css";
import { useNavigate } from "react-router-dom";
import { fetchDataActivityById } from "./service/ActivityService";
import { openDetail, toggleVisibility } from "./ActivityFunc";
import { navigateRouting, sezioniMenu, sezioniMenuIniziale, showError } from "../../App";
import { Pulsante } from "../../components/msbutton/Button";
import Schedule from "../../components/msschedule/Schedule";
import { myDisplayer } from "../../general/Utils";



const ActivityContent: React.FC<any> = ({
  user,
  identificativo,
  visibiityButton // Proprietà opzionale per la sottolineatura

}) => {

  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  let menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `activity`, {}, 0);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `about`, {}, 1);
  menuLaterale = sezioniMenu(sezioniMenuIniziale, navigate, `points`, { email: user.email }, 2);

  const [labelText] = React.useState('Nessun dato aggiuntivo'); // Stato dinamico per il testo della label
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [errors, setErrors] = useState('Si è verificato un errore! Controlla i dettagli.')
  const titleLabel = activityStore.testo.find(item => item._id === identificativo)?.nome || '';
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const flex = isVertical ? 'flex-start' : 'flex-end';

  const pulsanteRed: Pulsante = {
    icona: 'fas fa-download',
    funzione: () => toggleVisibility(identificativo, () => handleClickMostraLabel(identificativo)), // Passi la funzione direttamente
    nome: 'red',
    title: 'Carica sottotesto'
  };

  const pulsanteBlue: Pulsante = {
    icona: 'fas fa-eye',
    funzione: () => openDetail(identificativo, () => componentDidMount(identificativo)), // Passi la funzione direttamente
    nome: 'blue',
    title: 'Apri dettaglio'
  };
  useEffect(() => {

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const componentDidMount = (_id: string) => {
    // Effettua la chiamata GET quando il componente è montato
    fetchDataActivityById(_id, () => showError(setOpen, setErrors))
      .then((response) => {
        if (response.status === 'OK') {
          activityStore.setTestoById(_id, response.testo);  
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

  const handleClickMostraLabel = (_id: string) => {

    return fetchDataActivityById(_id, () => showError(setOpen, setErrors)).then((response) => {
      if (response) {
        const subTesto = response.testo.subTesto && response.testo.subTesto !== '' ? response.testo.subTesto : 'Nessun dato aggiuntivo';
        return myDisplayer("label-" + _id, subTesto)
      }
    })
  }

  const handleClose = () => {
    setOpen(false);
  };

  pulsanteRed.funzione = () => toggleVisibility(identificativo, () => handleClickMostraLabel(identificativo));
  pulsanteBlue.funzione = () => openDetail(identificativo, () => componentDidMount(identificativo));

  // Crea l'array dei pulsanti in base all'orientamento
  const pulsantiVisibili = isVertical ? [pulsanteBlue] : [pulsanteRed, pulsanteBlue]

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
