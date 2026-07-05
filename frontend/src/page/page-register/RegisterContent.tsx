"use client";
import { Trans, useLingui } from "@lingui/react";
import { Minus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button as ShadcnButton } from "@/components/ui/button";
import { FormField, PasswordField } from "@/components/ui/form-field";
import { Separator } from "@/components/ui/separator";
import { AlertConfig } from "../../components/ms-alert/Alert";
import Button, { Pulsante } from "../../components/ms-button/Button";
import { ButtonName, SectionName } from "../../general/structure/Constant";
import { navigateRouting, ResponseI, showMessage, UserI } from "../../general/structure/Utils";
import { register } from "../page-user-point/service/UserPointService";
import "./RegisterContent.css";

interface RegisterContentProps {
  user: UserI;
  alertConfig: AlertConfig;
  isVertical: boolean;
}

export interface PointRegister {
  password: string;
  email: string;
}

const RegisterContent: React.FC<RegisterContentProps> = ({ user, alertConfig, isVertical }) => {
  void isVertical;
  const { setUser } = useUser();
  const pathname = usePathname();
  void pathname;
  const { i18n } = useLingui();
  const router = useRouter();
  const labelRegister = {
    email: "Email di registazione",
    emailFiglio: "Email Figlio",
    points: "Punti",
  };
  void labelRegister;
  const [point, setPoint] = useState<number>(100);
  void point;
  void setPoint;
  const [email, setEmail] = useState<string>(user?.emailUserCurrent);
  const [password, setPassword] = useState<string>("");
  const [emailFigli, setEmailFigli] = useState<PointRegister[]>([
    { email: "child@simulated.com", password: "password" },
  ]);
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeEmailRegister = (index: number, value: string) => {
    const updatedEmails = [...emailFigli];
    updatedEmails[index].email = value;
    setEmailFigli(updatedEmails);
  };

  const handleAddEmailField = () => {
    setEmailFigli([...emailFigli, { email: "", password: "" }]);
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const toggleIcon = (indexToRemove: number) => {
    setEmailFigli((prevEmails) => prevEmails.filter((_, i) => i !== indexToRemove));
  };

  const pulsanteNew: Pulsante = {
    icona: "fas fa-plus",
    funzione: () => handleAddEmailField(),
    nome: ButtonName.NEW,
    title: i18n._("nuovo_tutorato"),
    configDialogPulsante: { message: i18n._("vuoi_aggiungere_un_tutorato"), showDialog: true },
  };

  const pulsanteBlue: Pulsante = {
    icona: "fas fa-circle-check",
    funzione: () => salvaRecord(user),
    nome: ButtonName.RED,
    title: i18n._("salva"),
    configDialogPulsante: { message: i18n._("vuoi_registrarti"), showDialog: true },
  };

  const salvaRecord = (userData: any): Promise<any> => {
    const arrayDiOggetti = emailFigli.map((pointRegister) => pointRegister.email);
    if (userData === undefined || userData === null) {
      userData = { email: email, emailFigli: email, emailUserCurrent: email, password: password };
    }
    setUser(null);
    return register(
      { ...userData, password: password, emailFigli: arrayDiOggetti, pointFigli: emailFigli },
      (message: any) => showMessage(alertConfig.setOpen, alertConfig.setMessage, message)
    ).then(() => {
      navigateRouting(router, SectionName.ROOT, { newLogin: true });
    });
  };

  const handleChangePoints = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setPoint(parseInt(event.target.value));
  };
  void handleChangePoints;

  return (
    <div className="box-register-content">
      <div className="testo-register mb-6">
        <p className="text-sm text-[var(--color-text-muted)]">
          <strong>
            <Trans id="register" />
          </strong>
        </p>
      </div>

      <div className="register-section-card">
        <div className="box-register space-y-4">
          <FormField
            id="register-email"
            label={i18n._("email")}
            value={email ?? ""}
            onChange={handleChangeEmail}
            disabled={user?.email !== undefined}
          />

          <PasswordField
            id="password"
            label={i18n._("password")}
            value={password}
            onChange={handleChangePassword}
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword((prev) => !prev)}
            toggleLabel={showPassword ? i18n._("nascondi_password") : i18n._("mostra_password")}
          />

          <div className="mb-4">
            <Separator className="register-divider" />
            <p className="text-sm text-[var(--color-text-muted)]">
              <strong>
                <Trans id="email_figli" />
              </strong>
            </p>
            <Separator className="register-divider" />

            <div>
              {emailFigli.map((emailFiglio, index) => (
                <div className="box-child mb-4" key={index}>
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-9">
                      <div className="relative">
                        <ShadcnButton
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={i18n._("remove")}
                          onClick={() => toggleIcon(index)}
                          className="absolute top-8 left-0 z-10"
                        >
                          <Minus className="size-4" />
                        </ShadcnButton>
                        <FormField
                          id={`child-email-${index}`}
                          label={`Email Figlio ${index + 1}`}
                          className="pl-8"
                          value={emailFiglio.email}
                          onChange={(e) => handleChangeEmailRegister(index, e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <FormField
                        id={`child-points-${index}`}
                        label={labelRegister.points}
                        value="100"
                        disabled
                        readOnly
                        type="number"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="button-right flex justify-end gap-2">
            <Button pulsanti={[pulsanteNew]} />
            <Button pulsanti={[pulsanteBlue]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterContent;
