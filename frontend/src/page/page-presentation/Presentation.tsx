"use client";

import Language from "@/components/ms-language/Language";
import "@/components/ms-presentation/Presentation.css";
import ThemeToggle from "@/components/ms-theme-toggle/ThemeToggle";
import { IconButton, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import PresentationContent from "./PresentationContent";
import "./PresentationContent.css";

const cdLogo = (
  <img
    src="/logo-colorsdev-v2.png"
    alt=""
    width={220}
    height={70}
    className="presentation-header-brand-logo"
    loading="lazy"
    decoding="async"
  />
);

const aziende: { name: string; icon: ReactNode; brandLogo?: boolean }[] = [
  { name: "colorsdev.tech", icon: cdLogo, brandLogo: true },
];

const PagePresentation: React.FC = () => {
  return (
    <div className="presentation-page">
      <div className="presentation-header">
        <div className="header-spacer" />

        <div className="techf-container">
          {aziende.map((tech) => (
            <div key={tech.name} className="techf-item">
              <IconButton color="inherit" disabled className="presentation-header-brand-btn">
                <span className={`techf-icon-wrap${tech.brandLogo ? " techf-icon-wrap-brand" : ""}`}>
                  {tech.icon}
                </span>
              </IconButton>
              <Typography variant="caption" display="block" className="techf-name">
                {tech.name}
              </Typography>
            </div>
          ))}
        </div>

        <div className="language-container">
          <ThemeToggle placement="header" />
          <Language placement="header" />
        </div>
      </div>

      <PresentationContent />
    </div>
  );
};
export default PagePresentation;
