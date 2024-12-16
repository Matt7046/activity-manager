
import './App.css';
import SubPromise from "./components/pageSubPromise/SubPromise";
import About from './components/pageAbout/About';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'; // Importa i componenti necessari
import '@fortawesome/fontawesome-free/css/all.min.css';

// App.tsx

export const sezioni = [
  ['Inbox', 'Starred', 'Send email', 'Drafts'],
  ['All mail', 'Trash', 'Spam'],
];

const App = () => {
  return (
    <Router>
      <div>
        <h1>App1 con Routing</h1>
        <nav>
          <ul>
           
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<SubPromise/>} /> {/* Rende il componente Home alla route '/' */}
          <Route path="/about" element={<About/>} />
          </Routes>
      </div>
    </Router>
  );
}


export const navigateRouting = (navigate: any, path: string, params:any ) => {
//const navigate = useNavigate(); // Ottieni la funzione di navigazione
  navigate(`/${path}`, { state: params }); // Passa il parametro come stato
}


export default App;

