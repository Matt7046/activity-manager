import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionName } from '../../general/structure/Constant';
import { navigateRouting } from '../../page/page-home/HomeContent';
import "./Presentation.css";


interface PresentationProps {

}



const Presentation: React.FC<PresentationProps> = ({ }) => {
  const [testoButton, setTestoButton] = useState<string>('Entra');
  const [testoEntry, setTestoEntry] = useState<string>('Benvenuto in Activity Manager');
  const [testoDesc, setTestoDesc] = useState<string>('Gestisci attività, punti e molto altro in famiglia!');
  const navigate = useNavigate();

  return (
    <Box
      className="welcome-container"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      p={4}
      sx={{
        background: 'linear-gradient(135deg, #f0f8ff, #e6f7ff)',
        borderRadius: '16px',
        boxShadow: 3,
        maxWidth: 600,
        margin: '4rem auto'
      }}
    >
      <Typography variant="h4" component="label" htmlFor="enter-button" gutterBottom fontWeight="bold">
        {testoEntry}
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        {testoDesc}
      </Typography>

      <Button
        id="enter-button"
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigateRouting(navigate, SectionName.HOME, {})}
        sx={{ mt: 3, borderRadius: '8px', px: 4 }}
      >
        {testoButton}
      </Button>
    </Box>
  );
}

export default Presentation;

