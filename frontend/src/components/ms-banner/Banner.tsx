"use client";
import { navigateRouting } from "@/general/structure/Utils";
import { Trans } from "@lingui/react";
import { useRouter } from 'next/navigation';
import React from "react";
import { SectionName } from "../../general/structure/Constant";
import "./Banner.css"; // <-- Importa il CSS

const BannerOpenSource: React.FC = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

  };

const handleClick = () => {
    navigateRouting(router, SectionName.POLICY, { newLogin: true });
  };

  return (
    <div className="banner">
        <form onSubmit={handleSubmit} className="form">
          <label className="text">
            <Trans id="iscriviti"/>{" "}
            <label onClick={handleClick} className="link">
              <Trans id="privacy_policy" />
            </label>
            {" | "} 
            <a 
              href="https://github.com/Matt7046/activity-manager" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link"
              style={{ cursor: 'pointer', textDecoration: 'none' }}
            >
                <Trans id="github_repo" />
            </a>
          </label>      
        </form>      
    </div>
  );
}

export default BannerOpenSource;
