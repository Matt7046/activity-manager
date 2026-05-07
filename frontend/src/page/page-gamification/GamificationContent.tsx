"use client";
import { Trans, useLingui } from "@lingui/react";
import { Box, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from "react";
import { AlertConfig } from "../../components/ms-alert/Alert";
import VideoGrid from "../../components/ms-video-grid/MsVideoGrid";
import { UserI } from "../../general/structure/Utils";
import gamificationStore from "./store/GamificationStore";

import "./GamificationContent.css";


interface GamificationContentProps {
  user: UserI;
  alertConfig: AlertConfig,
  isVertical: boolean;
}


const GamificationContent: React.FC<GamificationContentProps> = ({
  user,
  alertConfig,
  isVertical
}) => {

  const pathname = usePathname();
  const { i18n } = useLingui();
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);
  const [isWatching, setIsWatching] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const useWatchTime = (isActive: boolean) => {
    const secondsRef = useRef(0);
    const intervalRef = useRef<any>(null);

    useEffect(() => {
      if (isActive) {
        intervalRef.current = setInterval(() => {
          secondsRef.current += 1;
          gamificationStore.setMinutes(getMinutes())
        }, 1000);
      }

      return () => clearInterval(intervalRef.current);
    }, [isActive]);

    const getMinutes = () => Math.floor(secondsRef.current / 60);

    return { getMinutes };
  };

  const { getMinutes } = useWatchTime(isWatching);

  useEffect(() => {
    //fetchOptions();
    return () => { };
  }, [inizialLoad]);

  useEffect(() => {
    if (selectedVideo) {
      setIsWatching(true);
    } else {
      setIsWatching(false);
    }
  }, [selectedVideo]);
  return (
    <Box className="box-gamification-content">
      <Typography variant="body2" color="text.secondary" className="popover-header-text">
        <Trans id="info_guadagno_punti_video" /> <strong>{user?.emailUserCurrent}</strong>
      </Typography>

      <Box className="gamification-section-card">
        <Grid size={{ xs: 12 }}>
          <Box className="video-grid-wrapper">
            <VideoGrid
              selectedVideo={selectedVideo}
              handlePlayVideo={(videoId) => setSelectedVideo(videoId)}
              alertConfig={alertConfig}
              user={user} />
          </Box>
        </Grid>
      </Box>
    </Box>
  );

};


export default GamificationContent;
