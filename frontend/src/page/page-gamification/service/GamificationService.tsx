"use client";
import { deleteData, getData, PATH_GAMIFICATION, postData } from "../../../general/service/AxiosService";
import { ResponseI } from "../../../general/structure/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";
import { FavoriteI } from "../Gamification";



export const fetchVideo = async (
  topic: string,
  email: string,
  funzioneMessage?: (message?: TypeMessage) => void,
  setLoading?: (loading: boolean) => void
): Promise<ResponseI | undefined> => {
  topic = topic || "tutorial";
  try {
    const path = `${PATH_GAMIFICATION}/videos/${encodeURIComponent(topic)}/${encodeURIComponent(email)}`;
    const data = await getData(path, setLoading);
    return data;
  } catch (error) {
    console.error("Error fetching video data:", error);
    throw error;
  }
};

export const saveFavorite = async (favorite: FavoriteI, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_GAMIFICATION + `/videos/favorite`;
    const showSuccess = true;
    const data = await postData(path, favorite, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    return data;
  } catch (error) {
    throw error;
  }
}


export const deleteFavorite = async (favorite: FavoriteI, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_GAMIFICATION + `/videos/favorite`;
    const showSuccess = true;
    const data = await deleteData(path, favorite, setLoading, funzioneMessage, showSuccess);
    return data;
  } catch (error) {
    throw error;
  }
}

export const fetchVideosFavorites = async (topic: string, email: string, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    topic = topic || "tutorial"; 
    const path = `${PATH_GAMIFICATION}/videos/favorite/${encodeURIComponent(topic)}/${encodeURIComponent(email)}`;
    const data = await getData(path, setLoading);
    return data;
  } catch (error) {
    throw error;
  }
}