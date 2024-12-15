import { observer } from 'mobx-react';
import subPromiseStore from '../pageSubPromise/store/SubPromiseStore';


const NomeDisplay = observer((props: {
  key: number;
  value: string;
  rowIndex: number; handleClick: () => void
  
}) => {
  return (
    <h1 id={'displayer-' + props.rowIndex.toString()} onClick={props.handleClick}>
      {props.value} {/* Mostra il testo dallo store */}
    </h1>
  );
})
export default NomeDisplay;
