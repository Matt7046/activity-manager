import { i18n } from "@lingui/core";
import { useState } from 'react';
import { ResponseI, UserI } from '../../general/structure/Utils';
import { ActivityLogI } from '../../page/page-activity/Activity';
import { savePointsAndLog } from '../../page/page-activity/service/ActivityService';
import { fetchDataVideo } from '../../page/page-gamification/service/GamificationService';
import gamificationStore from '../../page/page-gamification/store/GamificationStore';
import { showMessage } from '../../page/page-home/HomeContent';
import { TypeMessage } from '../../page/page-layout/PageLayout';
import { AlertConfig } from '../ms-alert/Alert';
import Button, { Pulsante } from '../ms-button/Button';
import './MsVideoGrid.css';

export interface VideoI {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

type Props = {
  selectedVideo: string | null;
  handlePlayVideo: (videoId: string | null) => void;
  user: UserI;
  alertConfig: AlertConfig;
};


const fetchOptions = async (testo: string) => {
  try {
    return fetchDataVideo(testo).then((response: ResponseI | undefined) => {
      gamificationStore.setVideo(response?.jsonText ?? []);
      return response;
    }).catch((error) => {
      console.error('Error fetching options:', error);
    });
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};

const VideoGrid = ({ selectedVideo, handlePlayVideo, alertConfig, user }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [videos, setVideos] = useState<VideoI[]>([]);


  const savePoints = () => {
    const emailFind = user.emailChild ? user.emailChild : user.email;

    // Crea il log dell'attività
    const activityLog: ActivityLogI = {
      ...user,
      log: "Visione Corso", // Non è necessario usare '!' se hai fatto il check
      date: new Date(),
      usePoints: -gamificationStore.getPoints(),
      email: emailFind
    };

    // Salva il log dell'attività
    savePointsAndLog(activityLog, (message?: TypeMessage) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message))
      .then((response: ResponseI | undefined) => {
        //fetchPoints();
      })
  };

  // 2. Modifica la funzione interna per chiamare quella del padre
  const onPlayClick = (videoId: string | null) => {
    handlePlayVideo(videoId); // Questo aggiornerà lo stato nel genitore
  };

  const searchButton = (testo: string): Pulsante => {
    return {
      icona: "fas fa-search",
      nome: "blue",
      title: "Ricerca video",
      funzione: () => {
        console.log("Ricerca video:", testo)
        fetchOptions(testo).then((response: ResponseI|void) => {
          if (response) {
            setVideos(response.jsonText);
          }
        })
        onPlayClick(null);
      },
      configDialogPulsante: {
        showDialog: false,
        message: "Confermi di voler ricercare i video?"
      }
    }
  }

  const createButtonTrophy = (videoId: string): Pulsante[] => [
    {
      icona: "fas fa-trophy",
      nome: "red",
      title: "Completa e guadagna punti",
      funzione: () => {
        const minutes = gamificationStore.getMinutes();
        const points = minutes; // 1 punto = 1 minuto
        console.log("Minuti visti:", minutes);
        console.log("Punti assegnati:", points);
        gamificationStore.addPoints(points);
        savePoints();
        gamificationStore.ResetPointsMinutes();     
        console.log("Punti assegnati")
      },
      configDialogPulsante: {
        showDialog: true,
        message: "Vuoi aggiungere i punti premio del video?"
      }
    }];


  const createButtonPreferiti = (videoId: string): Pulsante[] => [

    {
      icona: "fas fa-star",
      nome: "blue",
      title: "Aggiungi ai preferiti",
      funzione: () => console.log("Preferito:", videoId),
      configDialogPulsante: {
        showDialog: true,
        message: "Vuoi aggiungere questo video ai preferiti?"
      }
    },
  ];

  const createButtonWatch = (videoId: string): Pulsante[] => [
    {
      icona: "fas fa-play",
      nome: "blue",
      title: "Guarda video",
      // Attiva la visualizzazione del player e nasconde la griglia
      funzione: () => onPlayClick(videoId),
      configDialogPulsante: {
        showDialog: false,
        message: ""
      }
    }
  ];


  const createButtons = (videoId: string): Pulsante[] => {
    return createButtonWatch(videoId).concat(createButtonPreferiti(videoId))
  }

  const createButtonsSelectedVideo = (videoId: string): Pulsante[] => {
    return createButtonPreferiti(videoId).concat(createButtonTrophy(videoId))
  }

  return (
    <div className="container">

      {/* 🔍 SEARCH SEMPRE VISIBILE */}
      <div className="search-container">
        <input
          type="text"
          placeholder={i18n._("cerca_video")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <Button pulsanti={[searchButton(searchQuery)]} />
      </div>

      {/* 🎬 PLAYER SE VIDEO SELEZIONATO */}
      {selectedVideo ? (
        <div className="video-player-container">
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${selectedVideo}`}
            title={i18n._("youtube_video_player")}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="video-overlay">
            <Button pulsanti={createButtonsSelectedVideo(selectedVideo)} />
          </div>
        </div>
      ) : (
        /* 🎥 GRID SE NESSUN VIDEO SELEZIONATO */
        <div className="video-grid">
          {videos.map((video: VideoI) => (
            <div key={video.videoId} className="video-card">
              <div className="video-thumbnail-container">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="video-thumbnail"
                />

                <div className="video-overlay">
                  <Button pulsanti={createButtons(video.videoId)} />
                </div>
              </div>

              <div className="video-info">
                <h4>{video.title}</h4>
                <p>{video.channelTitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default VideoGrid;