import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';

export interface Pulsante {
  icona: string
  nome :string
  funzione : ((...args: any[]) => any),
  callBackEnd?: ((...args: any[]) => any);
  title: string,
  visibility? : boolean
  disableButton?: boolean
}

const Button = observer((props: {
  pulsanti :Pulsante[]
}) => {
    const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);  

  useEffect(() => {
  
      const handleResize = () => {
        setIsVertical(window.innerHeight > window.innerWidth);
      };
  
      window.addEventListener("resize", handleResize);
  
      // Pulisci il listener al dismount
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  return (
    <div
      className="col-button-container"
      style={{
        gridColumn: 'span 2',
        display: 'flex',
        gridTemplateColumns: '2fr 1fr',
        gap: '12px',
       // visibility: visibilityButton ? 'visible' : 'hidden',      
      }}
    >
      {props.pulsanti.map((button, index) => (
        <div key={index} className="col-button">
          <button
            id={`button-${index}`}
            className={button.nome === 'red' ? 'button-red' : 'button-blue'}
            title={button.title}
            onClick={() => button.funzione()}
            style={{            
              backgroundColor: button.disableButton ? 'initial' : 'initial',
              color: button.disableButton ? 'initial' : 'initial',
              opacity: button.disableButton ? 0.3 : 1,
              pointerEvents: button.disableButton ? 'none' : 'auto',
              cursor: button.disableButton ? 'not-allowed' : 'pointer',
              border: button.disableButton ? '1px solid lightgrey' : 'initial',
            }}
          >

            <i className={button.icona}></i>
            {/* Testo accanto all'icona */}
          </button>
        </div>
      ))}
    </div>
  );  
})

export default Button;