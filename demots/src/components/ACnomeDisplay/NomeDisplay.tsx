import { observer } from 'mobx-react';

const NomeDisplay = observer((props: {
  key: number;
  value: string;
  rowIndex: number; handleClick: () => void
  
}) => {
 return ( 
  <>
    <h2 id={'displayer-' + props.rowIndex.toString()} onClick={props.handleClick}>
      {props.value} {/* Mostra il testo dallo store */}
    </h2>
  </>
);

})
export default NomeDisplay;
