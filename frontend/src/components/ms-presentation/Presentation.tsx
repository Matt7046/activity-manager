import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionName } from '../../general/structure/Constant';
import { navigateRouting } from '../../page/page-home/HomeContent';
import BannerOpenSource from '../ms-banner/Banner';
import "./Presentation.css";


interface PresentationProps {

}



const Presentation: React.FC<PresentationProps> = ({ }) => {
  const [testoButton, setTestoButton] = useState<string>('Entra');
  const [testoEntry, setTestoEntry] = useState<string>('Benvenuto in Activity Manager');
  const [testoDesc, setTestoDesc] = useState<string>('Gestisci attività, punti e molto altro in famiglia!');
  const navigate = useNavigate();

  return (
    <><BannerOpenSource></BannerOpenSource>
    <Box
      className="welcome-container"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <Typography variant="h4" component="label" htmlFor="enter-button" gutterBottom fontWeight="bold">
        {testoEntry}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {testoDesc}
      </Typography>

      <Button
        id="enter-button"
        className='enter-button'
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigateRouting(navigate, SectionName.HOME, {})}
      >
        {testoButton}
      </Button>
    </Box></>
  );
}

export default Presentation;

