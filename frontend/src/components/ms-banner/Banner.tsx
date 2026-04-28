import { Trans } from "@lingui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { SectionName } from "../../general/structure/Constant";
import { navigateRouting } from "../../page/page-home/HomeContent";
import "./Banner.css"; // <-- Importa il CSS

const BannerOpenSource: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

  };

  const handleClick = () => {
    navigateRouting(navigate, SectionName.POLICY, { newLogin: true });
  };

  return (
    <div className="banner">
    
        <form onSubmit={handleSubmit} className="form">
          <label className="text">
            <Trans id="iscriviti"/>{" "}
            <label onClick={handleClick} className="link">
              <Trans id="privacy_policy" />
            </label>
          </label>      
        </form>      
    </div>
  );
};

export default BannerOpenSource;
