"use client";
import { navigateRouting } from "@/general/structure/Utils";
import { Trans, useLingui } from "@lingui/react";
import { Box, Button, Link as MuiLink, Typography } from "@mui/material";
import LinkNext from "next/link";
import { useRouter } from "next/navigation";
import BannerOpenSource from "../../components/ms-banner/Banner";
import "../../components/ms-presentation/Presentation.css";
import TechFooter from "../../components/ms-tech-footer/TechFooter";
import { SectionName } from "../../general/structure/Constant";
import "./PresentationContent.css";

const PresentationContent: React.FC = () => {
  const router = useRouter();
  const { i18n } = useLingui();

  return (
    <>
      <Box className="page-wrapper">
        <BannerOpenSource />
        <Box className="welcome-container">
          <Box className="hero-frame">
            <Box className="hero-content">
              <Typography
                variant="h4"
                component="label"
                htmlFor="enter-button"
                gutterBottom
                fontWeight="bold"
                className="welcome-description-title"
              >
                <Trans id="testo_entry" />
              </Typography>

              <Typography variant="body1" gutterBottom className="welcome-description">
                <Trans id="testo_desc" />
              </Typography>

              <Button
                id="enter-button"
                className="enter-button"
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigateRouting(router, SectionName.HOME, {})}
              >
                <Trans id="testo_button" />
              </Button>

              <Typography variant="body2" className="personality-link-row">
                <MuiLink component={LinkNext} href="/personality" className="personality-link">
                  {i18n._("personality_discover_link")}
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="tech-wrapper">
        <TechFooter />
      </Box>
    </>
  );
};

export default PresentationContent;
