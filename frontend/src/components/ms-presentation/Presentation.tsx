import { Trans } from "@lingui/react";
import ReactIcon from '@mui/icons-material/Code'; // Potrebbe non esserci un'icona specifica, usa un generico
import JavaIcon from '@mui/icons-material/Coffee'; // Esempio
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
    { name: 'GPT (AI)', icon: <PsychologyIcon fontSize="large" className="tech-icon" /> },
  ];

  return (
    <>
      <BannerOpenSource />
      <Box className="welcome-container">
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
