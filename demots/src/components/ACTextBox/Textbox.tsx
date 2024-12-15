import { observer } from 'mobx-react';


interface TextBoxProps {
  text: string;
  style?: React.CSSProperties; // Per permettere la personalizzazione dello stile
}

const TextBox = observer((props: TextBoxProps) => {
  const testo = props.text;
  const style = props.style;

  return (
    <div className="text-box" style={style}>
      {testo}
    </div>
  );
});

export default TextBox;




