"use client";
import { navigateRouting } from "@/general/structure/Utils";
import { Trans } from "@lingui/react";
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { SectionName } from '../../general/structure/Constant';
import BannerOpenSource from '../ms-banner/Banner';
import TechFooter from "../ms-tech-footer/TechFooter";
import "./Presentation.css";



interface PresentationProps {

}



const Presentation: React.FC<PresentationProps> = ({ }) => {
  const router = useRouter();

  return (
    <>
      <Box className="page-wrapper">
        <BannerOpenSource />
        <Box className="welcome-container">
          <Box className="hero-content">
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
        </Box>
      </Box>
      <Box className="tech-wrapper">

        <TechFooter />
      </Box>

    </>
  );
}

export default Presentation;
