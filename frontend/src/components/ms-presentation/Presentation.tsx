import { Trans } from "@lingui/react";
import ReactIcon from '@mui/icons-material/Code'; // Potrebbe non esserci un'icona specifica, usa un generico
import JavaIcon from '@mui/icons-material/Coffee'; // Esempio
import HubIcon from '@mui/icons-material/Hub';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SpringBootIcon from '@mui/icons-material/PlayCircleFilled'; // Esempio
import PsychologyIcon from '@mui/icons-material/Psychology';
import SearchIcon from '@mui/icons-material/Search';
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
  const [testoButton] = useState<string>('Entra');
  const [testoEntry] = useState<string>('Benvenuto in Activity Manager');
  const [testoDesc] = useState<string>('Gestisci attività, punti e molto altro in famiglia!');
  const navigate = useNavigate();

  const technologies = [
    { name: 'MongoDB Cloud', icon: <MongoDBIcon fontSize="large" className="tech-icon" /> },
    { name: 'React', icon: <ReactIcon fontSize="large" className="tech-icon" /> },
    { name: 'Java', icon: <JavaIcon fontSize="large" className="tech-icon" /> },
    { name: 'Spring Boot', icon: <SpringBootIcon fontSize="large" className="tech-icon" /> },
    { name: 'ElasticSearch', icon: <SearchIcon fontSize="large" className="tech-icon" /> },
    { name: 'RabbitMQ', icon: <HubIcon fontSize="large" className="tech-icon" /> },
    { name: 'Docker', icon: <Inventory2Icon fontSize="large" className="tech-icon" /> },
    { name: 'GPT (AI)', icon: <PsychologyIcon fontSize="large" className="tech-icon" /> },
  ];

  return (
    <>
    <Box className="page-wrapper">
      <BannerOpenSource />
      <Box className="welcome-container">
        <Typography
          variant="h4"
          component="label"
          htmlFor="enter-button"
          gutterBottom
          fontWeight="bold"
          className="welcome-description-title"
        >
          {testoEntry}
        </Typography>

        <Typography
          variant="body1"
          gutterBottom
          className="welcome-description"
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
        >
          {testoButton}
        </Button>
      </Box>

      <Box className="tech-footer-container">
        <Typography variant="h6" gutterBottom>
          <Trans id="tecnologie_che_utilizzo" />
        </Typography>
        <Grid container justifyContent="center" spacing={2}> {/* Ridotto leggermente lo spacing per mobile */}
          {technologies.map((tech) => (
            <Grid item key={tech.name} xs={4} sm={3} md={2}> {/* xs={4} permette di averne 3 per riga invece di 2 */}
              <IconButton color="inherit" disabled style={{ padding: '8px' }}>
                {tech.icon}
              </IconButton>
              <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem' }}>
                {tech.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
      </Box>
    </>
  );
}

export default Presentation;
