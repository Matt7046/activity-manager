import { Trans, useLingui } from "@lingui/react";
import { Box, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertConfig } from "../../components/ms-alert/Alert";
import VideoGrid from "../../components/ms-video-grid/MsVideoGrid";
import { UserI } from "../../general/structure/Utils";
import "./GamificationContent.css";
import gamificationStore from "./store/GamificationStore";


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

  const location = useLocation();
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
         {/* INTESTAZIONE PAGINA */}
   
         <Box className="box-gamification-content">
           {/* INTESTAZIONE PAGINA */}
           <Typography variant="body2" color="text.secondary" className="popover-header-text">
             <Trans id="info_guadagno_punti_video" /> <strong>{user.emailUserCurrent}</strong>
           </Typography>
         </Box>
   
      <Grid container>
        <Grid xs={12}>
          <Box className="video-grid-wrapper">
            <VideoGrid
              selectedVideo={selectedVideo}
              handlePlayVideo={(videoId) => setSelectedVideo(videoId)}
              alertConfig={alertConfig}
              user={user} />
          </Box>
        </Grid>

        {/* Se aggiungerai altri elementi sotto, seguiranno il padding corretto */}
      </Grid>
    </Box>
  );

};


export default GamificationContent;
