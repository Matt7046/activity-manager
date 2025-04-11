import React from "react";
import { useNavigate } from "react-router-dom";
import { navigateRouting } from "../../App";
import { SectionName } from "../../general/Constant";
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
            Iscriviti per ricevere aggiornamenti sul nostro progetto open source.
            Tratteremo i tuoi dati personali esclusivamente per inviarti comunicazioni relative al progetto. 
            Per maggiori dettagli, consulta la nostra{" "}
            <label onClick={handleClick} className="link">
              Privacy Policy
            </label>
          </label>      
        </form>      
    </div>
  );
};

export default BannerOpenSource;
