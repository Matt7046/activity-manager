import { observer } from 'mobx-react';


export interface Pulsante {
  icona: string
  nome :string
  funzione : any,
  title: string
}


const Button = observer((props: {
  //key: number;
  visibilityButton: boolean;
  pulsanti :Pulsante[]
}) => {
  return (
    <div
      className="col-button-container"
      style={{
        gridColumn: 'span 2',
        display: 'flex',
        gridTemplateColumns: '2fr 1fr',
        gap: '12px',
        visibility: props.visibilityButton ? 'visible' : 'hidden',
      }}
    >
      {props.pulsanti.map((button, index) => (
        <div key={index} className="col-button">
          <button
            id={`button-${index}`}
            className={button.nome === 'red' ? 'button-red' : 'button-blue'}
            title={button.title}
            onClick={() => button.funzione()}
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