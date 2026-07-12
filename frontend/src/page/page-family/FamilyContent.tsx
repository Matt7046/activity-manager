"use client";
import { useUser } from "@/context/UserContext";
import { Trans, useLingui } from "@lingui/react";
import { Minus, Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertConfig } from "../../components/ms-alert/Alert";
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, HttpStatus, TypeAlertColor } from "../../general/structure/Constant";
import {
  FormErrorValues,
  getFamilyAccountEmail,
  ResponseI,
  showMessage,
  verifyForm,
} from "../../general/structure/Utils";
import { PointRegister } from "../page-register/RegisterContent";
import { findByEmail, getEmailChild } from "../page-user-point/service/UserPointService";
import "./FamilyContent.css";
import { savePointsByFamily, updateChildrenByFamily } from "./service/FamilyService";
import familyStore from "./store/FamilyStore";

interface FamilyContentProps {
  alertConfig: AlertConfig;
  isVertical: boolean;
}

const FamilyContent: React.FC<FamilyContentProps> = ({ alertConfig, isVertical: _isVertical }) => {
  const { user } = useUser();
  const { i18n } = useLingui();

  type FormValues = { newPoints: string };

  const [disableButtonSave, setDisableButtonSave] = useState(true);
  const [formValues, setFormValues] = useState<FormValues>({ newPoints: "0" });
  const [isPlusIcon, setIsPlusIcon] = useState(true);
  const [inizialLoad, setInitialLoad] = useState<boolean>(true);
  void setInitialLoad;

  const [childRows, setChildRows] = useState<PointRegister[]>([]);
  const [baselineEmails, setBaselineEmails] = useState<string[]>([]);

  const toggleIcon = () => setIsPlusIcon((prev) => !prev);

  const applyEmailFigliResponse = (emailFigli: string[] | undefined) => {
    const list = emailFigli ?? [];
    const trimmed = list.map((e) => String(e).trim()).filter((e) => e.length > 0);
    setChildRows(trimmed.map((email) => ({ email, password: "" })));
    setBaselineEmails([...trimmed]);
  };

  const loadFigli = (): Promise<ResponseI | undefined> => {
    const parentEmail = getFamilyAccountEmail(user);
    if (!parentEmail) return Promise.resolve(undefined);
    return getEmailChild(
      {
        ...user,
        emailUserCurrent: parentEmail,
        email: user.emailChild,
        onlyCheckedChildren: false,
      },
      (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
    ).then((res) => {
      if (res?.status === HttpStatus.OK) {
        applyEmailFigliResponse(res?.jsonText?.emailFigli as string[] | undefined);
      }
      return res;
    });
  };

  useEffect(() => {
    const emailFind = user.emailChild;
    findByEmail(
      { ...user, email: emailFind },
      (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
    ).then((response: ResponseI | undefined) => {
      if (response?.status === HttpStatus.OK) {
        familyStore.setPoints(response.jsonText.points);
        familyStore.setEmail(user.email);
        const errors: FormErrorValues = verifyForm(formValues);
        setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0);
      }
    });
  }, [inizialLoad]);

  useEffect(() => {
    if (!getFamilyAccountEmail(user)) return;
    void loadFigli();
  }, [user?.email, user?.emailUserCurrent, user?.emailChild]);

  useEffect(() => {
    const errors: FormErrorValues = verifyForm(formValues);
    setDisableButtonSave(Object.keys(errors).filter((key) => errors[key] === true).length > 0);
  }, [formValues]);

  const normalizedDesired = useMemo(
    () =>
      childRows
        .map((r) => r.email.trim())
        .filter((e) => e.length > 0)
        .sort()
        .join("|"),
    [childRows]
  );

  const normalizedBaseline = useMemo(
    () =>
      baselineEmails
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
        .sort()
        .join("|"),
    [baselineEmails]
  );

  const hasChildChanges = normalizedDesired !== normalizedBaseline;

  const handleChangeEmailFiglio = (index: number, value: string) => {
    const next = [...childRows];
    next[index] = { ...next[index], email: value };
    setChildRows(next);
  };

  const addFiglioRow = () => setChildRows([...childRows, { email: "", password: "" }]);
  const removeFiglioRow = (index: number) => setChildRows((prev) => prev.filter((_, i) => i !== index));

  const salvaFigli = (): Promise<ResponseI | undefined> => {
    const desired = childRows.map((r) => r.email.trim()).filter((e) => e.length > 0);
    if (new Set(desired).size !== desired.length) {
      showMessage(alertConfig.setOpen, alertConfig.setMessage, {
        titleMessage: i18n._("conferma_operazione"),
        typeMessage: TypeAlertColor.ERROR,
        message: [i18n._("email_duplicate_figli")],
      });
      return Promise.resolve(undefined);
    }
    const desiredSet = new Set(desired);
    const baseSet = new Set(baselineEmails.map((e) => e.trim()).filter(Boolean));
    const ops: { email: string; operation: boolean }[] = [];
    baselineEmails.forEach((e) => {
      const t = e.trim();
      if (t.length > 0 && !desiredSet.has(t)) ops.push({ email: t, operation: false });
    });
    desired.forEach((e) => {
      if (!baseSet.has(e)) ops.push({ email: e, operation: true });
    });
    if (ops.length === 0) return Promise.resolve(undefined);
    const parentEmail = getFamilyAccountEmail(user);
    if (!parentEmail) return Promise.resolve(undefined);
    return updateChildrenByFamily(
      { userPoint: { emailUserCurrent: parentEmail }, userPointChild: ops },
      (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message),
      undefined,
      true
    ).then((res) => {
      if (res?.status === HttpStatus.OK && res?.jsonText?.emailFigli) {
        applyEmailFigliResponse(res.jsonText.emailFigli as string[]);
      }
      return res;
    });
  };

  const pulsanteBlue: Pulsante = {
    icona: "fas fa-circle-check",
    funzione: () => salvaRecord(user),
    nome: ButtonName.BLUE,
    disableButton: disableButtonSave,
    title: i18n._("salva"),
    configDialogPulsante: {
      message: isPlusIcon ? i18n._("vuoi_aggiungere_punti") : i18n._("vuoi_sottrarre_punti"),
      showDialog: true,
    },
  };

  const pulsanteNewFiglio: Pulsante = {
    icona: "fas fa-plus",
    funzione: () => addFiglioRow(),
    nome: ButtonName.NEW,
    title: i18n._("nuovo_tutorato"),
    configDialogPulsante: { message: i18n._("vuoi_aggiungere_un_tutorato"), showDialog: true },
  };

  const pulsanteSalvaFigli: Pulsante = {
    icona: "fas fa-circle-check",
    funzione: () => salvaFigli(),
    nome: ButtonName.RED,
    disableButton: !hasChildChanges,
    title: i18n._("salva"),
    configDialogPulsante: { message: i18n._("vuoi_salvare"), showDialog: true },
  };

  const salvaRecord = (userData: any): Promise<any> => {
    const n = parseInt(formValues.newPoints, 10);
    const amount = Number.isFinite(n) && !Number.isNaN(n) ? n : 0;
    const pointsWithPlus = isPlusIcon ? amount : -amount;
    return savePointsByFamily(
      { ...userData, email: user.emailChild, usePoints: pointsWithPlus },
      (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
    ).then((x) => {
      if (x?.jsonText?.points !== undefined) {
        familyStore.setPoints(parseInt(x.jsonText.points));
      }
    });
  };

  return (
    <div className="box-family-content">
      <p className="text-sm text-[var(--color-text-muted)]">
        <Trans id="operazioni_famiglia" /> <strong>{user?.emailUserCurrent}</strong>
      </p>

      <div className="family-section-card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="family-email"
            label={i18n._("email")}
            value={user?.emailChild ?? ""}
            disabled
            readOnly
          />

          <FormField
            id="points-current"
            label={i18n._("punti")}
            value={String(familyStore.getStore().points)}
            disabled
            readOnly
          />

          <div className="form-control-family space-y-1">
            <Label htmlFor="new-points-input" className="font-bold text-[var(--color-text)]">
              {i18n._("nuovi_punti")}
            </Label>
            <div className="flex items-center gap-2">
              <ShadcnButton
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={i18n._("add_punti")}
                onClick={toggleIcon}
              >
                {isPlusIcon ? <Plus className="size-4 text-[var(--color-primary)]" /> : <Minus className="size-4 text-[var(--color-danger)]" />}
              </ShadcnButton>
              <Input
                id="new-points-input"
                value={formValues.newPoints}
                onChange={(e) => setFormValues({ ...formValues, newPoints: e.target.value })}
                type="number"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button pulsanti={[pulsanteBlue]} />
        </div>
      </div>

      <div className="family-section-card mt-4">
        <p className="mb-2 text-sm text-[var(--color-text-muted)]">
          <strong>
            <Trans id="email_figli" />
          </strong>
        </p>
        <Separator className="my-4" />
        <div>
          {childRows.map((row, index) => (
            <div key={index} className="family-child-row mb-4">
              <div className="relative">
                <ShadcnButton
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={i18n._("remove")}
                  onClick={() => removeFiglioRow(index)}
                  className="absolute top-8 left-0 z-10"
                >
                  <Minus className="size-4" />
                </ShadcnButton>
                <FormField
                  id={`family-child-${index}`}
                  label={`${i18n._("email")} ${index + 1}`}
                  className="pl-8"
                  value={row.email}
                  onChange={(e) => handleChangeEmailFiglio(index, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <Button pulsanti={[pulsanteNewFiglio]} />
          <Button pulsanti={[pulsanteSalvaFigli]} />
        </div>
      </div>
    </div>
  );
};

export default FamilyContent;
