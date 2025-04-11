import Grid from '@mui/material/Grid2';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import Button, { Pulsante } from '../ms-button/Button';
import Label from '../ms-label/Label';
import './Schedule.css';

export interface MsSchedule {
  justifyContent?: string;
  onClose?: () => void;  // La funzione onClose non ha parametri e non ritorna nulla
  handleClose: () => void;  // La funzione handleClose non ha parametri e non ritorna nulla
  schedule: { _id: string; nome: string; subtesto: string }[]; // Array di oggetti con proprietà _id, nome e subtesto
  isVertical: boolean;  // La visibilità del bottone, un booleano
  pulsanti: Pulsante[];  // Array di oggetti Pulsante
}


const Schedule = observer((props: {
  schedule: MsSchedule
}) => {
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [subTesti, setSubTesti] = useState<{ [key: string]: string }>({});


  const handleSubTestoUpdate = (itemId: string, subTesto: string) => {
    setSubTesti((prev) => ({
      ...prev,
      [itemId]: subTesto, // Imposta subTesto per il dato specifico
    }));
  };
  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);

    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <div className="row">
        {/* Pulsante "NEW" solo una volta all'inizio */}
        {props.schedule.pulsanti.filter(
          (pulsante) => pulsante.nome.toUpperCase() === 'NEW'
        ).map((pulsante) => (
          <Grid container justifyContent="space-between" alignItems="center" spacing={2} key="newButton" 
          className="new-button-container">

            <Button 
              pulsanti={[{ ...pulsante },
              ]}
            />
          </Grid>
        ))}


        {/* Iterazione sui dati dello schedule */}
        {props.schedule.schedule.map((item) => {
          //  handleSubTestoUpdate(item._id,item.subtesto);
          // Creazione dei pulsanti "RED"
          const pulsanteWithFunctionRED = props.schedule.pulsanti
            .filter((pulsante) => pulsante.nome.toUpperCase() === 'RED')
            .map((pulsante) => ({
              ...pulsante, // Copia tutte le altre proprietà del pulsante
              funzione: (_id: string) => {
                funzionalitaPulsanteRed(item, pulsante, handleSubTestoUpdate, subTesti);
              }
              //visibility: !isVertical
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
              visibility: true
            }));

          // Uniamo i pulsanti "RED" e gli altri
          let pulsanti = [
            ...pulsanteWithFunctionRED,
            ...pulsanteWithFunctionOther,
          ];
          pulsanti = pulsanti.map((x) => {
            x.disableButton = x.nome.toUpperCase() === "RED" && isVertical;
            return x;
          });
          const pulsantiDom: HTMLElement[] = [];
          Object.keys(subTesti).forEach((_id) => {
            const element = document.querySelector(`#rowHidden-${_id}`) as HTMLElement;
            pulsantiDom.push(element);
          });

          const visibilitySubTesto = pulsantiDom.some((element) => element.style.visibility === '');
          return (
            <React.Fragment key={item._id}>

              <div className="col-display">
                <Label text={item.nome} _id={item._id} />
              </div>

              <Grid container justifyContent={props.schedule.justifyContent} spacing={2} style={{ height: '30px' }}>
                <Button pulsanti={pulsanti} />
              </Grid>
              <div id={`rowHidden-${item._id}`} style={{ gridColumn: 'span 12' }}>
                <Label _id={item._id} text={subTesti[item._id]} visibility={isVertical && visibilitySubTesto ? 'hidden' : undefined} />
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

export const funzionalitaPulsanteRed = (item: any, pulsante: Pulsante, handleSubTestoUpdate: any, subTesti: any) => {
  const _id = item._id;

  const element = document.querySelector(`#rowHidden-${_id}`) as HTMLElement;
  const check = (element.style.visibility === "" && subTesti[item._id] === undefined) || element.style.visibility === "hidden";
  // Rimuove il valore inline
  if (check) {
    element.style.visibility = ""; // Rimuove il valore inline
    pulsante.funzione(_id).then((response: { jsonText: { subTesto: string; }; }) => {
      handleSubTestoUpdate(item._id, response.jsonText.subTesto);     
    })
  } else {
    element.style.visibility = "hidden"; // mette il valore inline
  }
  return check; // Aggiorna lo stato
};



export default Schedule;