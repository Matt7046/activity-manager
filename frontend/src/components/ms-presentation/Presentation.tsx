import { useNavigate } from 'react-router-dom';
import { SectionName } from '../../general/structure/Constant';
import { navigateRouting } from '../../page/page-home/HomeContent';
import "./Presentation.css";


interface PresentationProps {

}

const Presentation: React.FC<PresentationProps> = ({ }) => {

  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Benvenuto in Activity Manager</h1>
      <p>Gestisci attività, punti e molto altro in famiglia!</p>
      <button
        onClick={() => navigateRouting(navigate, SectionName.HOME, {})}
        style={{
          padding: '0.5rem 1.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          marginTop: '1rem'
        }}
      >
        Entra
      </button>
    </div>
  );
};

export default Presentation;

