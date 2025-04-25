import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionName } from '../../general/structure/Constant';
import { navigateRouting } from '../../page/page-home/HomeContent';
import "./Presentation.css";


interface PresentationProps {

}

const [testoButton, setTestoButton] = useState<string>('Entra');

const Presentation: React.FC<PresentationProps> = ({ }) => {

  const navigate = useNavigate();
  return (
    <div className="welcome-container">
      <label htmlFor="enter-button" className="welcome-title">Benvenuto in Activity Manager</label>
      <p className="welcome-subtitle">Gestisci attività, punti e molto altro in famiglia!</p>
      <button
        id="enter-button"
        className="welcome-button"
        onClick={() => navigateRouting(navigate, SectionName.HOME, {})}
      >
        {testoButton}
      </button>
    </div>
  );
}

export default Presentation;

