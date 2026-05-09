"use client";
import { UserPointsI } from "@/page/page-user-point/UserPoint";
import { PATH_USER_POINT, postData } from "../../../general/service/AxiosService";
import { TypeMessage } from "../../page-layout/PageLayout";



export const resetPassword = async (userDTO: UserPointsI, funzioneMessage?: (message?: TypeMessage) => void, setLoading?: (loading: boolean) => void) => {
  try {
    const path = PATH_USER_POINT + `/dati/user/reset/password`;
    const showSuccess = true;
    const data = await postData(path, userDTO, setLoading, funzioneMessage, showSuccess);
    return data;
  } catch (error) {
  }
};