"use client";
import { Trans, useLingui } from "@lingui/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormField } from "@/components/ui/form-field";
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus, SectionName, TypeUser } from "../../general/structure/Constant";
import { FormErrorValues, navigateRouting, showMessage, UserI, verifyForm, getUserChildDisplay } from "../../general/structure/Utils";
import { deleteAboutById, saveActivity, showMessageAboutForm } from "../page-activity/service/ActivityService";
import activityStore from "../page-activity/store/ActivityStore";
import { TypeMessage } from "../page-layout/PageLayout";
import "./AboutContent.css";

interface AboutContentProps {
  identificativo: string;
  user: UserI;
  setMessage: React.Dispatch<React.SetStateAction<TypeMessage>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isVertical: boolean;
}

const AboutContent: React.FC<AboutContentProps> = ({
  identificativo,
  user,
  setMessage,
  setOpen,
  isVertical,
}) => {
  void isVertical;
  const pathname = usePathname();
  void pathname;
  const router = useRouter();
  const { i18n } = useLingui();
  const [disableButtonSave, setDisableButtonSave] = useState<boolean>();
  const [disableButtonDelete, setDisableButtonDelete] = useState<boolean>(
    identificativo === null || identificativo === undefined || user?.type === TypeUser.STANDARD
  );
  const descrizione = activityStore.activity.find((x) => identificativo === x._id)?.subTesto;
  const [subTesto, setSubTesto] = useState(descrizione);

  type FormValues = {
    [key: string]: string | number;
  };

  const [formValues, setFormValues] = useState<FormValues>({
    activity: activityStore.activity.find((x) => identificativo === x._id)?.nome ?? "",
    points: activityStore.activity.find((x) => identificativo === x._id)?.points ?? 0,
  });

  const [formErrors, setFormErrors] = useState<FormErrorValues>({
    activity: true,
    points: true,
  });
  void formErrors;

  useEffect(() => {
    const errors: FormErrorValues = verifyForm(formValues);
    setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0);
  }, [formValues]);

  useEffect(() => {
    if (identificativo === null || identificativo === undefined) {
      setSubTesto("");
      setFormValues({ activity: "", points: 0 });
    }
  }, [identificativo]);

  const handleButtonClick = () => {
    const errors: FormErrorValues = verifyForm(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).filter((key) => errors[key] === true).length === 0) {
      salvaRecord(identificativo);
    } else {
      const erroriCampi = Object.keys(formErrors).filter((key) => errors[key] === true);
      let errorFields: string[] = [];
      if (erroriCampi.length > 0) {
        errorFields = ["I valori invalidi sono:"].concat(erroriCampi);
      }
      showMessageAboutForm((message?: TypeMessage) =>
        showMessage(setOpen, setMessage, { ...message, message: errorFields })
      );
    }
  };

  const pulsanteRed: Pulsante = {
    icona: "fas fa-solid fa-trash",
    funzione: () => cancellaRecord(identificativo),
    disableButton: disableButtonDelete,
    nome: ButtonName.RED,
    title: i18n._("elimina"),
    visibility: !!identificativo,
    configDialogPulsante: { message: i18n._("vuoi_eliminare_il_record"), showDialog: true },
  };

  const pulsanteBlue: Pulsante = {
    icona: "fas fa-circle-check",
    funzione: () => handleButtonClick(),
    disableButton: disableButtonSave,
    nome: ButtonName.BLUE,
    title: i18n._("salva"),
    configDialogPulsante: { message: i18n._("confermi_loperazione"), showDialog: true },
  };

  const pulsanteReturn: Pulsante = {
    icona: "fas fa-arrow-left",
    funzione: () => returnActivity(),
    nome: ButtonName.BACK,
    title: i18n._("ritorna"),
    configDialogPulsante: { message: "", showDialog: false },
  };

  const handleChangeActivity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, activity: event.target.value });
  };

  const handleChangePoints = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, points: parseInt(event.target.value) });
  };

  const handleChangeSubTesto = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSubTesto(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };
  void handleClose;

  const cancellaRecord = (_id: string | null): void => {
    deleteAboutById(_id, (message?: TypeMessage) => showMessage(setOpen, setMessage, message)).then(
      (response) => {
        if (response?.status === HttpStatus.OK) {
          navigateRouting(router, SectionName.ACTIVITY, {});
        }
      }
    );
  };

  const returnActivity = (): void => {
    navigateRouting(router, SectionName.ACTIVITY, {});
  };

  const salvaRecord = (_id: string | null): void => {
    const emailFind = user.emailChild ? user.emailChild : user.email;
    const testo = {
      ...user,
      _id: _id,
      nome: formValues.activity,
      subTesto: subTesto,
      points: formValues.points,
      email: emailFind,
    };
    saveActivity(testo, (message?: TypeMessage) => showMessage(setOpen, setMessage, message)).then(
      (response) => {
        if (response?.jsonText) {
          setDisableButtonDelete(false);
          navigateRouting(router, SectionName.ACTIVITY, {});
        }
      }
    );
  };

  return (
    <div className="box-about">
      <p className="text-sm text-[var(--color-text-muted)]">
        {user?.type === TypeUser.FAMILY && !identificativo ? (
          <>
            <Trans id="dettaglio_attivita" />
            <strong>{getUserChildDisplay(user)}</strong>
          </>
        ) : (
          <>
            <Trans id="dettaglio_attivita_child" />
            <strong>{getUserChildDisplay(user)}</strong>
          </>
        )}
      </p>

      <div className="about-section-card">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <FormField
              id="about-email"
              label={i18n._("email")}
              value={getUserChildDisplay(user)}
              disabled
              readOnly
            />
          </div>

          <div className="sm:col-span-8">
            <FormField
              id="activity"
              label={i18n._("attivita")}
              value={String(formValues.activity)}
              onChange={handleChangeActivity}
              disabled={user?.type === TypeUser.STANDARD}
              required
            />
          </div>

          <div className="sm:col-span-4">
            <FormField
              id="points"
              label={i18n._("punti")}
              type="number"
              value={String(formValues.points ?? 0)}
              onChange={handleChangePoints}
              disabled={user?.type === TypeUser.STANDARD}
              required
            />
          </div>

          <div className="col-span-full">
            <FormField
              id="description"
              label={i18n._("descrizione")}
              multiline
              rows={5}
              value={subTesto ?? ""}
              onChange={handleChangeSubTesto}
            />
          </div>

          <div className="about-action-row col-span-full flex w-full items-center justify-between">
            <div>
              <Button pulsanti={[pulsanteReturn]} />
            </div>
            <div className="about-action-buttons">
              <Button pulsanti={[pulsanteRed, pulsanteBlue]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;
