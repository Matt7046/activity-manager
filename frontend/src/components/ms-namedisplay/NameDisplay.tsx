import { observer } from 'mobx-react';

const NomeDisplay = observer((props: {
  value: string;
  identificativo: string;
  handleClick?: () => void

}) => {
  return (
    <>
      <h2 id={'displayer-' + props.identificativo} onClick={props.handleClick}>
        {props.value} {/* Mostra il testo dallo store */}
      </h2>
    </>
  );

})
export default NomeDisplay;
