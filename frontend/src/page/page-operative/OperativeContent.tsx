"use client";
import { Trans, useLingui } from "@lingui/react";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { FormField } from "@/components/ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectOption,
} from "@/components/ui/select";
import { AlertConfig } from "../../components/ms-alert/Alert";
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus, TypeUser } from "../../general/structure/Constant";
import { FormErrorValues, ResponseI, showMessage, UserI, verifyForm } from "../../general/structure/Utils";
import { ActivityLogI } from "../page-activity/Activity";
import { fetchDataActivities, savePointsAndLog } from "../page-activity/service/ActivityService";
import { TypeMessage } from "../page-layout/PageLayout";
import { findByEmail } from "../page-user-point/service/UserPointService";
import "./OperativeContent.css";
import { showMessageOperativeForm } from "./service/OperativeService";
import operativeStore from "./store/OperativeStore";

interface OperativeContentProps {
  user: UserI;
  alertConfig: AlertConfig;
  isVertical: boolean;
}

const OperativeContent: React.FC<OperativeContentProps> = ({ user, alertConfig, isVertical }) => {
  void isVertical;
  const pathname = usePathname();
  void pathname;
  const { i18n } = useLingui();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingO, setIsLoadingO] = useState(true);
  const [disableButtonSave, setDisableButtonSave] = useState(true);
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);
  void setInitialLoad;

  type FormValues = {
    [key: string]: string | undefined;
  };

  const [formValues, setFormValues] = useState<FormValues>({ activity: "" });
  const [formErrors, setFormErrors] = useState<FormErrorValues>({ activity: true, points: true });
  void formErrors;

  useEffect(() => {
    fetchOptions();
    fetchPoints();
    return () => {};
  }, [inizialLoad]);

  useEffect(() => {
    const errors: FormErrorValues = verifyForm(formValues);
    setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0);
    if (user?.type === 1) {
      operativeStore.setEmailField(user?.email);
    } else {
      operativeStore.setEmailField(user?.emailChild);
    }
  }, [formValues]);

  const handleButtonClick = () => {
    const errors: FormErrorValues = verifyForm(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).filter((key) => errors[key] === true).length === 0) {
      saveActivity(user);
    } else {
      const erroriCampi = Object.keys(formErrors).filter((key) => errors[key] === true);
      let errorFields: string[] = [];
      if (erroriCampi.length > 0) {
        errorFields = ["I valori invalidi sono:"].concat(erroriCampi);
      }
      showMessageOperativeForm((message?: TypeMessage) =>
        showMessage(alertConfig.setOpen, alertConfig.setMessage, { ...message, message: errorFields })
      );
    }
  };

  const handleChangePoints = (event: React.ChangeEvent<HTMLInputElement>) => {
    operativeStore.setPoints(parseInt(event.target.value));
  };

  const fetchOptions = () => {
    try {
      const emailFind = user?.emailChild ? user?.emailChild : user?.email;
      return fetchDataActivities({ ...user, email: emailFind }).then((response: ResponseI | undefined) => {
        setIsLoadingO(false);
        operativeStore.setActivity(response?.jsonText ?? []);
      });
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchPoints = () => {
    try {
      const emailFind = user?.emailChild ? user?.emailChild : user?.email;
      findByEmail(
        { ...user, email: emailFind },
        (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
      ).then((response: ResponseI | undefined) => {
        if (response?.status === HttpStatus.OK) {
          setIsLoading(false);
          operativeStore.setPoints(response.jsonText.points);
        }
      });
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const pulsanteSave: Pulsante = {
    icona: "fas fa-circle-check",
    funzione: () => handleButtonClick(),
    nome: ButtonName.RED,
    disableButton: disableButtonSave,
    title: i18n._("salva"),
    configDialogPulsante: { message: i18n._("vuoi_salvare"), showDialog: true },
  };

  const clickCombobox = (selectedValue: string) => {
    setFormValues({ ...formValues, activity: selectedValue });
    const selectedActivity = operativeStore.activity.find((item) => item._id === selectedValue);
    if (!selectedActivity) {
      console.error("Activity not found");
      return;
    }
    operativeStore.setPointsField(selectedActivity.points!);
  };

  const activitySelectOptions = useMemo<SelectOption[]>(
    () =>
      operativeStore.activity.map((option) => ({
        value: option._id!,
        label: option.nome ?? option._id!,
      })),
    [operativeStore.activity]
  );

  const saveActivity = (user: UserI) => {
    const selectedActivity = operativeStore.activity.find((item) => item._id === formValues.activity);
    if (!selectedActivity) {
      console.error("Activity not found");
      return;
    }
    const emailFind = user.emailChild ? user.emailChild : user.email;
    const activityLog: ActivityLogI = {
      ...user,
      log: selectedActivity.nome,
      date: new Date(),
      usePoints: operativeStore.pointsField,
      email: emailFind,
    };

    savePointsAndLog(activityLog, (message?: TypeMessage) =>
      showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
    ).then(() => {
      fetchPoints();
    });
  };

  if (isLoading || isLoadingO) {
    return (
      <p>
        <Trans id="caricamento" />
      </p>
    );
  }

  return (
    <div className="box-operative-content">
      <p className="text-sm text-[var(--color-text-muted)]">
        {user?.type === TypeUser.FAMILY ? (
          <Trans id="operazioni_attivita" />
        ) : (
          <Trans id="operazioni_attivita_child" />
        )}{" "}
        <strong>{user?.emailUserCurrent}</strong>
      </p>

      <div className="operative-section-card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="operative-email"
            label={i18n._("email")}
            value={user?.emailChild ?? ""}
            disabled
            readOnly
          />

          <FormField
            id="filled-adornment-points"
            label={i18n._("punti")}
            value={String(operativeStore.points)}
            onChange={handleChangePoints}
            disabled
            readOnly
          />

          <div className="form-control-operative space-y-1">
            <label htmlFor="select-label" className="text-sm font-bold text-[var(--color-text)]">
              {i18n._("punti_attivitaobb")}
            </label>
            <Select
              options={activitySelectOptions}
              value={formValues?.activity ?? ""}
              onValueChange={(value) => value && clickCombobox(value)}
            >
              <SelectTrigger id="select-label" className="w-full">
                <SelectValue placeholder={i18n._("attivita")} />
              </SelectTrigger>
              <SelectContent>
                {operativeStore.activity.map((option) => (
                  <SelectItem key={option._id} value={option._id!}>
                    {option.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FormField
            id="points-field"
            label={i18n._("punti_attivita")}
            type="number"
            value={String(operativeStore?.pointsField ?? 0)}
            onChange={(e) => operativeStore.setPointsField(parseInt(e.target.value, 10))}
            disabled
            readOnly
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button pulsanti={[pulsanteSave]} />
        </div>
      </div>
    </div>
  );
};

export default OperativeContent;
