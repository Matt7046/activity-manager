import { Box } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertConfig } from "../../components/ms-alert/Alert";
import VideoGrid, { VideoI } from "../../components/ms-video-grid/MsVideoGrid";
import { UserI } from "../../general/structure/Utils";
import "./GamificationContent.css";
import gamificationStore from "./store/GamificationStore";


interface GamificationContentProps {
  user: UserI;
  alertConfig: AlertConfig,
  isVertical: boolean;
}

const sampleVideos: VideoI[] = [
  {
    videoId: "dQw4w9WgXcQ",
    title: "Video dimostrativo 1",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    channelTitle: "Canale Activity Manager"
  },
  {
    videoId: "3JZ_D3ELwOQ",
    title: "Video dimostrativo 2",
    thumbnail: "https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
    channelTitle: "Canale Activity Manager"
  },
  {
    videoId: "L_jWHffIx5E",
    title: "Video dimostrativo 3",
    thumbnail: "https://img.youtube.com/vi/L_jWHffIx5E/hqdefault.jpg",
    channelTitle: "Canale Activity Manager"
  }
];

const GamificationContent: React.FC<GamificationContentProps> = ({
  user,
  alertConfig,
  isVertical
}) => {

  const location = useLocation();
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
    <Box className="box-operative-content">
      <Grid container spacing={2}>
        <Grid xs={12}>
          <VideoGrid
            selectedVideo={selectedVideo}
            handlePlayVideo={(videoId) => setSelectedVideo(videoId)}
            alertConfig={alertConfig}
            user={user} />
        </Grid>
      </Grid>
    </Box>
  );

};


export default GamificationContent;
