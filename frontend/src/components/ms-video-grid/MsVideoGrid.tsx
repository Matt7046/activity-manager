"use client";
import { ButtonName, HttpStatus, TypeAlertColor } from "@/general/structure/Constant";
import { i18n } from "@lingui/core";
import { Search } from "lucide-react";
import { observer } from "mobx-react";
import { useCallback, useEffect, useRef, useState } from 'react';
import { ResponseI, showMessage, UserI } from '../../general/structure/Utils';
import { ActivityLogI } from '../../page/page-activity/Activity';
import { savePointsAndLog } from '../../page/page-activity/service/ActivityService';
import { FavoriteI } from "../../page/page-gamification/Gamification";
import { deleteFavorite, fetchVideo, fetchVideosFavorites, saveFavorite } from '../../page/page-gamification/service/GamificationService';
import gamificationStore from '../../page/page-gamification/store/GamificationStore';
import { TypeMessage } from '../../page/page-layout/PageLayout';
import { AlertConfig } from '../ms-alert/Alert';
import Button, { Pulsante } from '../ms-button/Button';

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
  getWatchMinutes: () => number;
  resetWatchTimer: () => void;
};

export const POINTS_UPDATED_EVENT = "activity-manager:points-updated";

const gamificationEmail = (user: UserI): string => {
  return (user.emailChild || user.email || "").trim();
}

const VideoGrid = observer(({ selectedVideo, handlePlayVideo, alertConfig, user, getWatchMinutes, resetWatchTimer }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [videos, setVideos] = useState<VideoI[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [lastFetchKey, setLastFetchKey] = useState<string>("");
  const hasLoadedRef = useRef(false);
  const email = gamificationEmail(user);

  const applyVideos = useCallback((list: VideoI[] | undefined) => {
    const next = Array.isArray(list) ? list : [];
    gamificationStore.setVideo(next);
    setVideos(next);
    hasLoadedRef.current = next.length > 0;
  }, []);

  const updateVideoFavorite = useCallback((videoId: string, favorite: boolean) => {
    setVideos((prev) => {
      let next = prev.map((v) => (v.videoId === videoId ? { ...v, favorite } : v));
      if (showFavoritesOnly && !favorite) {
        next = next.filter((v) => v.videoId !== videoId);
      }
      gamificationStore.setVideo(next);
      return next;
    });
  }, [showFavoritesOnly]);

  const fetchOptions = useCallback(async (testo: string, force = false) => {
    if (!email) {
      return undefined;
    }
    const query = testo?.trim() || "tutorial";
    const fetchKey = `${showFavoritesOnly ? "fav" : "all"}:${query}:${email}`;
    if (!force && fetchKey === lastFetchKey && hasLoadedRef.current) {
      return { jsonText: gamificationStore.getVideo(), status: HttpStatus.OK } as ResponseI;
    }

    try {
      const response = showFavoritesOnly
        ? await fetchVideosFavorites(query, email)
        : await fetchVideo(query, email);

      if (response?.status === HttpStatus.OK && Array.isArray(response.jsonText)) {
        applyVideos(response.jsonText as VideoI[]);
        setLastFetchKey(fetchKey);
      }
      return response;
    } catch (error) {
      console.error("Error fetching videos:", error);
      return undefined;
    }
  }, [showFavoritesOnly, email, lastFetchKey, applyVideos]);

  useEffect(() => {
    setSearchQuery("");
    setShowFavoritesOnly(false);
    setLastFetchKey("");
    hasLoadedRef.current = false;
    gamificationStore.setVideo([]);
    setVideos([]);
    handlePlayVideo(null);
  }, [email, user.emailUserCurrent, handlePlayVideo]);

  useEffect(() => {
    if (!email) {
      return;
    }
    void fetchOptions("tutorial", true);
  }, [email]);

  useEffect(() => {
    if (!email) {
      return;
    }
    void fetchOptions(searchQuery || "tutorial", true);
  }, [showFavoritesOnly]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && lastFetchKey) {
        void fetchOptions(searchQuery, true);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [lastFetchKey, searchQuery, fetchOptions]);

  const savePoints = (pointsToAdd: number) => {
    if (pointsToAdd <= 0) {
      showMessage(alertConfig.setOpen, alertConfig.setMessage, {
        titleMessage: i18n._("error_request_title"),
        typeMessage: TypeAlertColor.ERROR,
        message: [i18n._("gamification_no_watch_minutes")],
      });
      return;
    }

    const emailFind = email || user.email;

    const activityLog: ActivityLogI = {
      ...user,
      log: "Visione Corso",
      date: new Date(),
      usePoints: -pointsToAdd,
      email: emailFind,
    };

    savePointsAndLog(activityLog, (message?: TypeMessage) =>
      showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
    ).then((response: ResponseI | undefined) => {
      if (response?.status === HttpStatus.OK) {
        resetWatchTimer();
        handlePlayVideo(null);
        window.dispatchEvent(new CustomEvent(POINTS_UPDATED_EVENT));
        if (lastFetchKey) {
          void fetchOptions(searchQuery, true);
        }
      }
    });
  };

  const onPlayClick = (videoId: string | null) => {
    handlePlayVideo(videoId);
  };

  const searchButton = (testo: string): Pulsante => {
    return {
      icona: "fas fa-search",
      nome: ButtonName.BLUE,
      title: i18n._("ricerca_video"),
      funzione: () => {
        void fetchOptions(testo, true).then(() => onPlayClick(null));
      },
      configDialogPulsante: {
        showDialog: false,
        message: i18n._("confermi_di_voler_ricercare_i_video"),
      },
    };
  };

  const createButtonTrophy = (): Pulsante[] => [
    {
      icona: "fas fa-trophy",
      nome: "red",
      title: i18n._("completa_e_guadagna_punti"),
      funzione: () => {
        savePoints(getWatchMinutes());
      },
      configDialogPulsante: {
        showDialog: true,
        message: () => {
          const currentPoints = getWatchMinutes();
          return `Vuoi aggiungere i ${currentPoints} punti premio del video?`;
        },
      },
    },
  ];

  const createButtonPreferiti = (video: VideoI): Pulsante[] => [
    {
      icona: "fas fa-star",
      nome: video.favorite ? 'red' : "blue",
      title: video.favorite ? i18n._("elimina_dai_preferiti") : i18n._("aggiungi_ai_preferiti"),
      funzione: () => {
        const favorite: FavoriteI = {
          email,
          videoId: video.videoId,
        };
        const wasFavorite = video.favorite;
        const nextFavorite = !wasFavorite;
        updateVideoFavorite(video.videoId, nextFavorite);

        const rollback = () => updateVideoFavorite(video.videoId, wasFavorite);

        const onDone = (response: ResponseI | undefined) => {
          if (response?.status !== HttpStatus.OK) {
            rollback();
            return;
          }
          setLastFetchKey("");
          hasLoadedRef.current = false;
          void fetchOptions(searchQuery, true);
        };

        if (wasFavorite) {
          deleteFavorite(favorite, (message?: TypeMessage) =>
            showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
          ).then(onDone);
        } else {
          saveFavorite(favorite, (message?: TypeMessage) =>
            showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
          ).then(onDone);
        }
      },
      configDialogPulsante: {
        showDialog: true,
        message: video.favorite
          ? i18n._("vuoi_eliminare_questo_video_dai_preferiti")
          : i18n._("vuoi_aggiungere_questo_video_ai_preferiti"),
      },
    },
  ];

  const createButtonWatch = (video: VideoI): Pulsante[] => [
    {
      icona: "fas fa-play",
      nome: ButtonName.RED,
      title: i18n._("guarda_video"),
      funzione: () => onPlayClick(video.videoId),
      configDialogPulsante: {
        showDialog: false,
        message: "",
      },
    },
  ];

  const createButtons = (video: VideoI): Pulsante[] => {
    return createButtonPreferiti(video).concat(createButtonWatch(video));
  };

  const createButtonsSelectedVideo = (videoId: string): Pulsante[] => {
    const video = videos.find((v) => v.videoId === videoId);
    if (!video) {
      return createButtonTrophy();
    }
    return createButtonPreferiti(video).concat(createButtonTrophy());
  };

  const displayVideos = videos;

  return (
    <>
      <div className="box-border flex w-full flex-col gap-2 px-0 pt-5 pb-3">
        <label className="text-sm leading-snug font-semibold text-[var(--color-text)]" htmlFor="gamification-video-search">
          {i18n._("ricerca_video")}
        </label>
        <div className="flex w-full items-center justify-start gap-4">
          <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-[var(--radius-round)] border-2 border-[var(--color-muted-300)] bg-[var(--color-surface)] px-4 shadow-[var(--shadow-sm)] transition-[border-color,box-shadow] focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_3px_var(--color-primary-soft)]">
            <Search className="size-[22px] shrink-0 text-[var(--color-primary)] opacity-90" aria-hidden />
            <input
              id="gamification-video-search"
              type="search"
              placeholder={i18n._("cerca_video")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="m-0 min-w-0 flex-1 border-0 bg-transparent py-3 pr-2 pl-0 text-base text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted-500)]"
              autoComplete="off"
              enterKeyHint="search"
            />
          </div>
          <Button pulsanti={[searchButton(searchQuery)]} />
        </div>
      </div>

      <div className="flex w-full items-center justify-start pb-5">
        <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-round)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-info-soft)]">
          <input
            type="checkbox"
            className="size-[18px] accent-[var(--color-primary)]"
            checked={showFavoritesOnly}
            onChange={(e) => {
              setShowFavoritesOnly(e.target.checked);
              setLastFetchKey("");
              hasLoadedRef.current = false;
            }}
          />
          <span>{i18n._("mostra_preferiti")}</span>
        </label>
      </div>

      {selectedVideo ? (
        <div className="relative">
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${selectedVideo}`}
            title={i18n._("youtube_video_player")}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute right-4 bottom-4">
            <Button pulsanti={createButtonsSelectedVideo(selectedVideo)} />
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 py-5">
          {displayVideos.map((video: VideoI) => (
            <div
              key={video.videoId}
              className="flex w-[300px] flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
            >
              <div className="relative">
                <img src={video.thumbnail} alt={video.title} className="w-full rounded-t-[var(--radius-lg)]" />
                <div className="absolute right-4 bottom-4">
                  <Button pulsanti={createButtons(video)} />
                </div>
              </div>
              <div className="p-3">
                <h4 className="mb-1 font-semibold text-[var(--color-text)]">{video.title}</h4>
                <p className="text-sm text-[var(--color-text-muted)]">{video.channelTitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
});

export default VideoGrid;
