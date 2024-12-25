import React, { useEffect, useState } from "react";
import "./Operative.css";
import { useLocation, useNavigate } from "react-router-dom";
import { UserI } from "../../general/Utils";
const [open, setOpen] = useState(false);

interface OperativeContentProps {
  user: UserI;
  setErrors: any;
}

const OperativeContent: React.FC<OperativeContentProps> = ({
  user,
  setErrors
}) => {

  const location = useLocation();
  const navigate = useNavigate(); // Ottieni la funzione di navigazione
  const { _id } = location.state || {}; // Ottieni il valore dallo stato
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const padding = isVertical ? 5 : 8;

  useEffect(() => {

    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Crea l'array dei pulsanti in base all'orientamento
  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <div>
     
      </div>
    </>
  );
}

export default OperativeContent;
