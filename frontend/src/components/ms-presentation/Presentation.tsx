"use client";
import { navigateRouting } from "@/general/structure/Utils";
import { Trans, useLingui } from "@lingui/react";
import NextjsIcon from '@mui/icons-material/ChangeHistory';
import ReactIcon from '@mui/icons-material/Code'; // Potrebbe non esserci un'icona specifica, usa un generico
import JavaIcon from '@mui/icons-material/Coffee'; // Esempio
import HubIcon from '@mui/icons-material/Hub';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SpringBootIcon from '@mui/icons-material/PlayCircleFilled'; // Esempio
import PsychologyIcon from '@mui/icons-material/Psychology';
import SearchIcon from '@mui/icons-material/Search';
import MongoDBIcon from '@mui/icons-material/Storage';
import TranslateIcon from '@mui/icons-material/Translate';
import { Box, Button, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';
import { SectionName } from '../../general/structure/Constant';
import BannerOpenSource from '../ms-banner/Banner';
import "./Presentation.css";



interface PresentationProps {

}



const Presentation: React.FC<PresentationProps> = ({ }) => {
  const router = useRouter();
  const { i18n } = useLingui();

const technologies = [
  { name: 'MongoDB Cloud', icon: <MongoDBIcon fontSize="large" className="tech-icon" /> },
  { name: 'React', icon: <ReactIcon fontSize="large" className="tech-icon" /> },
  { name: 'Next.js', icon: <NextjsIcon fontSize="large" className="tech-icon" /> }, // Aggiunto
  { name: 'Java', icon: <JavaIcon fontSize="large" className="tech-icon" /> },
  { name: 'Spring Boot', icon: <SpringBootIcon fontSize="large" className="tech-icon" /> },
  { name: 'ElasticSearch', icon: <SearchIcon fontSize="large" className="tech-icon" /> },
  { name: 'RabbitMQ', icon: <HubIcon fontSize="large" className="tech-icon" /> },
  { name: 'Docker', icon: <Inventory2Icon fontSize="large" className="tech-icon" /> },
  { name: 'GPT (AI)', icon: <PsychologyIcon fontSize="large" className="tech-icon" /> },
  { name: 'Lingui', icon: <TranslateIcon fontSize="large" className="tech-icon" /> }, // Aggiunto
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
            <Trans id='testo_entry' />
          </Typography>

          <Typography
            variant="body1"
            gutterBottom
            className="welcome-description"          >
            <Trans id='testo_desc' />
          </Typography>

          <Button
            id="enter-button"
            className="enter-button"
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigateRouting(router, SectionName.HOME, {})}
          >
            <Trans id='testo_button' />
          </Button>
        </Box>

        <Box className="tech-footer-container">
          <Typography variant="h6" gutterBottom>
            <Trans id="tecnologie_che_utilizzo" />
          </Typography>
          <Grid container spacing={1}> {/* Ridotto lo spacing per mobile */}
            {technologies.map((tech) => (
              /* In MUI v6: 
                 - Rimosso 'item'
                 - Tutti i breakpoint dentro 'size'
                 - size 3 = 4 elementi per riga
                 - size 4 = 3 elementi per riga
              */
              <Grid
                key={tech.name}
                size={{ xs: 4, sm: 2, md: 2 }}
                className="tech-item"
              >
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
      </Box>
    </>
  );
}

export default Presentation;
