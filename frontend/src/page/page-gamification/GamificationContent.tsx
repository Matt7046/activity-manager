"use client";
import { Trans } from "@lingui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertConfig } from "../../components/ms-alert/Alert";
import VideoGrid from "../../components/ms-video-grid/MsVideoGrid";
import { UserI } from "../../general/structure/Utils";
import gamificationStore from "./store/GamificationStore";
import "./GamificationContent.css";

interface GamificationContentProps {
  user: UserI;
  alertConfig: AlertConfig;
  isVertical: boolean;
}

const GamificationContent: React.FC<GamificationContentProps> = ({ user, alertConfig }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const watchSecondsRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearWatchInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetWatchTimer = useCallback(() => {
    clearWatchInterval();
    watchSecondsRef.current = 0;
    gamificationStore.ResetPointsMinutes();
  }, [clearWatchInterval]);

  const getWatchMinutes = useCallback(() => {
    return Math.floor(watchSecondsRef.current / 60);
  }, []);

  const handlePlayVideo = useCallback((videoId: string | null) => {
    setSelectedVideo(videoId);
  }, []);

  useEffect(() => {
    gamificationStore.setVideo([]);
    gamificationStore.ResetPointsMinutes();
    setSelectedVideo(null);
    resetWatchTimer();
  }, [user.emailChild, user.emailUserCurrent, resetWatchTimer]);

  useEffect(() => {
    clearWatchInterval();
    if (selectedVideo) {
      watchSecondsRef.current = 0;
      gamificationStore.setMinutes(0);
      intervalRef.current = setInterval(() => {
        watchSecondsRef.current += 1;
        gamificationStore.setMinutes(Math.floor(watchSecondsRef.current / 60));
      }, 1000);
    }
    return clearWatchInterval;
  }, [selectedVideo, clearWatchInterval]);

  return (
    <div className="box-gamification-content">
      <p className="popover-header-text text-sm text-[var(--color-text-muted)]">
        <Trans id="info_guadagno_punti_video" /> <strong>{user?.emailUserCurrent}</strong>
      </p>

      <div className="gamification-section-card">
        <div className="video-grid-wrapper">
          <VideoGrid
            selectedVideo={selectedVideo}
            handlePlayVideo={handlePlayVideo}
            alertConfig={alertConfig}
            user={user}
            getWatchMinutes={getWatchMinutes}
            resetWatchTimer={resetWatchTimer}
          />
        </div>
      </div>
    </div>
  );
};

export default GamificationContent;
