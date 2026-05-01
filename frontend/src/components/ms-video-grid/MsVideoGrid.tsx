import { i18n } from "@lingui/core";
import { useState } from 'react';
import { ResponseI, UserI } from '../../general/structure/Utils';
import { ActivityLogI } from '../../page/page-activity/Activity';
import { savePointsAndLog } from '../../page/page-activity/service/ActivityService';
import { FavoriteI } from "../../page/page-gamification/Gamification";
import { deleteFavorite, fetchVideo, fetchVideosFavorites, saveFavorite } from '../../page/page-gamification/service/GamificationService';
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
  favorite: boolean
}

type Props = {
  selectedVideo: string | null;
  handlePlayVideo: (videoId: string | null) => void;
  user: UserI;
  alertConfig: AlertConfig;
};




const VideoGrid = ({ selectedVideo, handlePlayVideo, alertConfig, user }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [videos, setVideos] = useState<VideoI[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const fetchOptions = async (testo: string) => {
    try {
      if (showFavoritesOnly) {
        // Caso: Solo Favoriti
        return fetchVideosFavorites(testo, user.emailChild)
          .then((response: ResponseI | undefined) => {
            gamificationStore.setVideo(response?.jsonText ?? []);
            return response;
          })
          .catch((error) => {
            console.error('Error fetching favorites:', error);
          });
      } else {
        // Caso: Ricerca normale
        return fetchVideo(testo, user.emailChild)
          .then((response: ResponseI | undefined) => {
            gamificationStore.setVideo(response?.jsonText ?? []);
            return response;
          })
          .catch((error) => {
            console.error('Error fetching data video:', error);
          });
      }
    } catch (error) {
      console.error('General error in fetchOptions:', error);
    }
  };

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
      title: i18n._("ricerca_video"),
      funzione: () => {
        console.log("Ricerca video:", testo)
        fetchOptions(testo).then((response: ResponseI | void) => {
          if (response) {
            setVideos(response.jsonText);
          }
        })
        onPlayClick(null);
      },
      configDialogPulsante: {
        showDialog: false,
        message: i18n._("confermi_di_voler_ricercare_i_video")
      }
    }
  }

  const createButtonTrophy = (videoId: VideoI): Pulsante[] => [
    {
      icona: "fas fa-trophy",
      nome: "red",
      title: i18n._("completa_e_guadagna_punti"),
      funzione: () => {
        const points = gamificationStore.getMinutes();
        gamificationStore.addPoints(points);
        savePoints();
        gamificationStore.ResetPointsMinutes();
      },
      configDialogPulsante: {
        showDialog: true,
        // Passiamo una funzione () => ... invece di una stringa
        // Verrà eseguita solo quando l'utente preme il trofeo
        message: () => {
          const currentPoints = gamificationStore.getMinutes();
          return `Vuoi aggiungere i ${currentPoints} punti premio del video?`;
        }
      }
    }
  ];


  const createButtonPreferiti = (video: VideoI): Pulsante[] => [
    {
      icona: "fas fa-star",
      nome:  video.favorite ? 'red': "blue",
      // 1. Aggiunta virgola qui sotto
      title: video.favorite ? i18n._("elimina_dai_preferiti") : i18n._("aggiungi_ai_preferiti"),
      funzione: () => {
        console.log("Azione su preferito:", video.videoId);
        const favorite: FavoriteI = {
          email: user.emailChild,
          videoId: video.videoId
        };
        if (video.favorite) {
          deleteFavorite(favorite, (message?: TypeMessage) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message))
            .then((response: ResponseI | undefined) => {
              // Opzionale: ricarica i preferiti dopo l'eliminazione per aggiornare la griglia
              fetchOptions(searchQuery).then((res) => {
                if (res) setVideos(res.jsonText);
              });
            });
        } else {
          saveFavorite(favorite, (message?: TypeMessage) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message))
            .then((response: ResponseI | undefined) => {
               fetchOptions(searchQuery).then((res) => {
                if (res) setVideos(res.jsonText);
              });
            });
        }
      },
      configDialogPulsante: {
        showDialog: true,
        // 2. Messaggio dinamico basato sull'azione
        message: video.favorite
          ? i18n._("vuoi_eliminare_questo_video_dai_preferiti")
          : i18n._("vuoi_aggiungere_questo_video_ai_preferiti")
      }
    },
  ];

  const createButtonWatch = (videoId: VideoI): Pulsante[] => [
    {
      icona: "fas fa-play",
      nome: "blue",
      title: i18n._("guarda_video"),
      // Attiva la visualizzazione del player e nasconde la griglia
      funzione: () => onPlayClick(videoId.videoId),
      configDialogPulsante: {
        showDialog: false,
        message: ""
      }
    }
  ];


  const createButtons = (videoId: VideoI): Pulsante[] => {
    return createButtonWatch(videoId).concat(createButtonPreferiti(videoId))
  }

  const createButtonsSelectedVideo = (videoId: string): Pulsante[] => {
    const videoI: VideoI[] = gamificationStore.getVideo();
    const video = videoI.find((v) => v.videoId === videoId);
    return createButtonPreferiti(video!).concat(createButtonTrophy(video!))
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
      {/* --- NUOVO FILTRO FAVORITI --- */}
      <div className="filter-container">
        <label className="favorite-filter">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
          />
          <span>{i18n._("mostra_preferiti")}</span>
        </label>
      </div>
      {/* --------------------------- */}

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
                  <Button pulsanti={createButtons(video)} />
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