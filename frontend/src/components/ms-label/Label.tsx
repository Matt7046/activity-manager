import { observer } from 'mobx-react';
import './Label.css';

type Visibility = 'visible' | 'hidden' | 'collapse' | undefined;

interface LabelProps {
  _id: string;
  text: string;
  handleClick?: () => void;
  isUnderlined?: boolean;
  visibility?: Visibility;
}

const Label = observer((props: LabelProps) => {
  const style = {
    textDecoration: props.isUnderlined ? "underline" : "none",
    visibility: props.visibility,
  };

  return (
    <div className="label-container" key={props._id}>
      <label
        id={`label-${props._id}`}
        htmlFor={`label-${props._id}`}
        className="label-text"
        onClick={props.handleClick}
        style={style}
      >
        {props.text}
      </label>
    </div>
  );
});

export default Label;

