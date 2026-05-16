"use client";

import { Trans } from "@lingui/react";
import NextjsIcon from "@mui/icons-material/ChangeHistory";
import ReactIcon from "@mui/icons-material/Code";
import JavaIcon from "@mui/icons-material/Coffee";
import HubIcon from "@mui/icons-material/Hub";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SpringBootIcon from "@mui/icons-material/PlayCircleFilled";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";
import SecurityIcon from "@mui/icons-material/Security";
import MongoDBIcon from "@mui/icons-material/Storage";
import TranslateIcon from "@mui/icons-material/Translate";
import WebIcon from "@mui/icons-material/Web";
import { Box, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import type { ReactNode } from "react";
import "./TechFooter.css";

const cdLogo = (
  <img
    src="/logo-colorsdev-v2.png"
    alt=""
    width={36}
    height={36}
    className="techf-logo-brand"
    loading="lazy"
    decoding="async"
  />
);

const technologies: { name: string; icon: ReactNode; brandLogo?: boolean }[] = [
  { name: "MongoDB Cloud", icon: <MongoDBIcon fontSize="large" className="techf-icon" /> },
  { name: "React", icon: <ReactIcon fontSize="large" className="techf-icon" /> },
  { name: "Next.js", icon: <NextjsIcon fontSize="large" className="techf-icon" /> },
  { name: "Java", icon: <JavaIcon fontSize="large" className="techf-icon" /> },
  { name: "Spring Boot", icon: <SpringBootIcon fontSize="large" className="techf-icon" /> },
  { name: "ElasticSearch", icon: <SearchIcon fontSize="large" className="techf-icon" /> },
  { name: "Cloudinary", icon: <CloudUploadIcon fontSize="large" className="techf-icon" /> },
  { name: "RabbitMQ", icon: <HubIcon fontSize="large" className="techf-icon" /> },
  { name: "Docker", icon: <Inventory2Icon fontSize="large" className="techf-icon" /> },
  { name: "Nginx", icon: <WebIcon fontSize="large" className="techf-icon" /> },
  { name: "JWT Token", icon: <SecurityIcon fontSize="large" className="techf-icon" /> },
  { name: "GPT (AI)", icon: <PsychologyIcon fontSize="large" className="techf-icon" /> },
  { name: "Lingui", icon: <TranslateIcon fontSize="large" className="techf-icon" /> },
];

const TechFooter = () => {
  return (
    <Box className="techf-footer">
      <Typography variant="h6" gutterBottom className="techf-title">
        <Trans id="tecnologie_che_utilizzo" />
      </Typography>
      <Grid container spacing={1} columns={{ xs: 10, sm: 10, md: 10 }} className="techf-grid">
        {technologies.map((tech) => (
          <Grid key={tech.name} size={{ xs: 5, sm: 2, md: 2 }} className="techf-item">
            <IconButton color="inherit" disabled>
              <span className={`techf-icon-wrap${tech.brandLogo ? " techf-icon-wrap-brand" : ""}`}>{tech.icon}</span>
            </IconButton>
            <Typography variant="caption" display="block" className="techf-name">
              {tech.name}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TechFooter;

