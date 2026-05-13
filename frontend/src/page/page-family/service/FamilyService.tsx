"use client";
import { PATH_FAMILY_LOG, PATH_FAMILY_POINT, postData } from "../../../general/service/AxiosService";
import { ResponseI } from "../../../general/structure/Utils";
import { TypeMessage } from "../../page-layout/PageLayout";



export const getLogFamilyByEmail = async (pointsDTO: any,funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_FAMILY_LOG + `/log/tutor`;
    const data = await postData(path, pointsDTO, setLoading); // Usa l'URL dinamico
    return data;
  } catch (error) {   
  }
};


export const savePointsByFamily = async (user: any, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void,
  showSuccess?: boolean): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_FAMILY_POINT + `/dati`;
    showSuccess = true; 
    const data = await postData(path, user, setLoading, funzioneMessage, showSuccess); // Endpoint dell'API
    return data;
  } catch (error) {
  }

};

export type UserPointWithChildPayload = {
  userPoint: { emailUserCurrent: string };
  userPointChild: { email: string; operation: boolean }[];
};

export const updateChildrenByFamily = async (
  body: UserPointWithChildPayload,
  funzioneMessage?: (message?: TypeMessage) => void,
  setLoading?: (loading: boolean) => void,
  showSuccess?: boolean,
): Promise<ResponseI | undefined> => {
  try {
    const path = PATH_FAMILY_POINT + `/dati/child`;
    const data = await postData(path, body, setLoading, funzioneMessage, showSuccess ?? true);
    return data;
  } catch (error) {
  }
};

