import ReactIcon from '@mui/icons-material/Code'; // Potrebbe non esserci un'icona specifica, usa un generico
import JavaIcon from '@mui/icons-material/Coffee'; // Esempio
import SpringBootIcon from '@mui/icons-material/PlayCircleFilled'; // Esempio
import MongoDBIcon from '@mui/icons-material/Storage'; // Esempio di icona Material UI
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
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

  const technologies = [
    { name: 'MongoDB Cloud', icon: <MongoDBIcon fontSize="large" sx={{ color: 'red' }} /> },
    { name: 'React', icon: <ReactIcon fontSize="large" sx={{ color: 'red' }} /> },
    { name: 'Java', icon: <JavaIcon fontSize="large" sx={{ color: 'red' }} /> },
    { name: 'Spring Boot', icon: <SpringBootIcon fontSize="large" sx={{ color: 'red' }} /> },
    // Aggiungi altre tecnologie con le relative icone
  ];


  return (
    <>
      <BannerOpenSource />
      <Box
        className="welcome-container"      
      >
        <Typography
          variant="h4"
          component="label"
          htmlFor="enter-button"
          gutterBottom
          fontWeight="bold"
        
        >
          {testoEntry}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          gutterBottom
          sx={{
            lineHeight: 1.6,
            marginBottom: (theme) => theme.spacing(3),
            color: '#94a3b8', // Testo descrizione grigio
          }}
        >
          {testoDesc}
        </Typography>

        <Button
          id="enter-button"
          className="enter-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigateRouting(navigate, SectionName.HOME, {})}
          sx={{
            backgroundColor: '#4a5568', // Bottone grigio scuro
            color: '#f7fafc',
            padding: (theme) => theme.spacing(2, 4),
            borderRadius: '5px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: '#718096', // Hover più chiaro
            },
          }}
        >
          {testoButton}
        </Button>
      </Box>
      <Box
  sx={{
    backgroundColor: '#2d3748', // Un altro sfondo scuro per la sezione
    color: '#f7fafc',
    padding: (theme) => theme.spacing(6),
    textAlign: 'center',
    position: 'absolute', // Imposta la posizione come assoluta
    bottom: 0,           // Ancora al bordo inferiore del contenitore posizionato
    left: 0,             // Si estende dal bordo sinistro
    right: 0,            // Si estende fino al bordo destro
    zIndex: 1,           // Assicura che sia sopra altri elementi se necessario
  }}
>
  <Typography variant="h6" gutterBottom>
    Tecnologie che utilizzo
  </Typography>
  <Grid container justifyContent="center" spacing={4}>
    {technologies.map((tech) => (
      <Grid item key={tech.name} xs={6} sm={4} md={2} lg={1}>
        <IconButton color="inherit" disabled>
          {tech.icon}
        </IconButton>
        <Typography variant="caption" display="block">
          {tech.name}
        </Typography>
      </Grid>
    ))}
  </Grid>
</Box>
    </>
  );
}

export default Presentation;

