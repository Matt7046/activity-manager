import React, { useEffect } from 'react';
import AboutContent from './AboutContent';
import { useNavigate, useParams } from 'react-router-dom';
import Label from '../AClabel/label';
import handleClick from '../AClabel/labelFunc';
import { navigateRouting } from '../../App';
import subPromiseStore from '../pageSubPromise/store/SubPromiseStore';
import { ascoltatore } from '../pageSubPromise/SubPromiseFunc';
import { fetchDataPromiseById } from '../pageSubPromise/service/SubPromiseService';


const About: React.FC = () => {
  
 
  return (
    <>
      <AboutContent
        key={0} // Chiave univoca (modifica se necessario per un array di elementi)
        rowIndex={0} // Passa la riga corrente o aggiorna dinamicamente
      />
    </>
  );
};

export default About;






