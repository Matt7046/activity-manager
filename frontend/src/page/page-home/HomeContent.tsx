"use client";

import '@fortawesome/fontawesome-free/css/all.min.css';
import { Trans, useLingui } from "@lingui/react";
import { Loader2 } from "lucide-react";
import type { SelectChangeEvent } from "@/types/form-events";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import LinkNext from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Alert from '../../components/ms-alert/Alert';
import DialogEmail from '../../components/ms-dialog-email/DialogEmail';
import { GitHubBrandIcon, GoogleBrandIcon } from '../../components/ms-social/SocialBrandIcons';
import TechFooter from '../../components/ms-tech-footer/TechFooter';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField, PasswordField } from '@/components/ui/form-field';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getToken } from '../../general/service/AuthService';
import { isUserValorizzato } from '@/context/UserContext';
import { baseStore } from '../../general/structure/BaseStore';
import {
  CLIENT_FACEBOOK,
  CLIENT_GITHUB,
  CLIENT_GOOGLE,
  getGitHubOAuthRedirectUri,
  TypeAlertColor,
  TypeUser,
} from '../../general/structure/Constant';
import { isSimulatedDemoEmail } from '../../general/structure/simulatedAccounts';
import { redirectAfterLogin, ResponseI, showMessage, UserI } from '../../general/structure/Utils';
import { TypeMessage } from '../page-layout/PageLayout';
import { confirmParentLinks, getEmailChild, getTypeUser, oldLogin } from '../page-user-point/service/UserPointService';
import { HomeConfig } from './Home';
import "./HomeContent.css";
import { resetPassword } from './service/HomeService';

/** Login Facebook temporaneamente nascosto in home. */
const FACEBOOK_LOGIN_VISIBLE = false;

// Componente principale, avvolto da GoogleOAuthProvider
interface HomeContentProps {
  homeConfig: HomeConfig;
}

const HomeContent: React.FC<HomeContentProps> = ({ homeConfig }) => (
  <GoogleOAuthProvider clientId={CLIENT_GOOGLE.SERVER!}>
    <GoogleAuthComponent homeConfig={homeConfig} />
  </GoogleOAuthProvider>
);

// Componente di autenticazione
const GoogleAuthComponent: React.FC<HomeContentProps> = ({ homeConfig }) => {
  const { user, setUser, demoPanelOpen, setDemoPanelOpen } = homeConfig;

  const router = useRouter();  // Qui chiami useNavigate correttamente all'interno di un componente
  // useLingui() farà scattare il re-render automatico al cambio lingua
  const { i18n } = useLingui();
  const [open, setOpen] = useState(false); // Controlla la visibilità del messaggio
  const [loading, setLoading] = useState(false);
  const [simulated, setSimulated] = useState(0);
  const [openD, setOpenD] = useState(false); // Stato per la dialog
  const [emailConfirmDialog, setEmailConfirmDialog] = useState(''); // Stato per l'email
  const [message, setMessage] = React.useState<TypeMessage>({}); // Lo stato è un array di stringhe
  const [emailOptions, setEmailOptions] = React.useState<string[]>([]); // Lo stato è un array di stringhe
  const [emailLogin, setEmailLogin] = useState(''); // Stato per l'email
  const [passwordLogin, setPasswordLogin] = useState(''); // Stato per l'email
  const location = usePathname();
  const [isVertical, setIsVertical] = useState<boolean>(window.innerHeight > window.innerWidth);
  const [hiddenLogin, setHiddenLogin] = useState<any>(false); // Stato utente
  const handleChangeEmailFamily = (event: React.ChangeEvent<HTMLInputElement>) => { };
  const [showPassword, setShowPassword] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [openPendingParentsDialog, setOpenPendingParentsDialog] = useState(false);
  const [pendingParentsEmails, setPendingParentsEmails] = useState<string[]>([]);
  const [pendingParentsSelected, setPendingParentsSelected] = useState<Record<string, boolean>>({});
  const [pendingDialogChildEmail, setPendingDialogChildEmail] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const githubOAuthStateRef = useRef<string>("");
  const githubHomePopupBridgeDoneRef = useRef(false);
  const facebookSdkInitRef = useRef(false);

  type CurrentUserState = Partial<UserI> & { name?: string };

  const emptyCurrentUser = (): CurrentUserState => ({
    _id: undefined,
    name: "",
    emailChild: "",
    email: "",
    type: TypeUser.STANDARD,
    emailUserCurrent: "",
  });

  const toUserI = (payload: CurrentUserState): UserI => ({
    _id: payload._id,
    email: payload.email ?? "",
    emailChild: payload.emailChild ?? payload.emailUserCurrent ?? payload.email ?? "",
    type: (payload.type ?? TypeUser.STANDARD) as TypeUser,
    emailUserCurrent: payload.emailUserCurrent ?? payload.email ?? "",
    name: payload.name,
  });

  const completeLogin = useCallback(
    (nextUser: UserI, options?: { deferRedirect?: boolean }) => {
      setUser(nextUser);
      if (!options?.deferRedirect) {
        redirectAfterLogin(router, nextUser);
      }
    },
    [router, setUser]
  );

  const [currentUser, setCurrentUser] = useState<CurrentUserState>(emptyCurrentUser());

  //FAKE LOGIN
  const [userDataFake, setUserDataFake] = useState({
    name: "Simulated User",
    emailChild: "user@simulated.com",
    email: "user@simulated.com",
    type: TypeUser.STANDARD,
    emailUserCurrent: "user@simulated.com"
  }); // Stato per userData
  //FAKE LOGIN
  const [userDataChildFake, setUserDataChildFake] = useState({
    name: "Simulated child User",
    emailChild: "child@simulated.com",
    email: "user@simulated.com",
    type: TypeUser.STANDARD,
    emailUserCurrent: "child@simulated.com"
  }); // Stato per userData

  useEffect(() => {
    if (location === '/home') {
      setCurrentUser(emptyCurrentUser());
      setDemoPanelOpen(false);
    }
    setHiddenLogin(location === '/privacy-policy');
    return () => {};
  }, [location, setDemoPanelOpen]);

  useEffect(() => {
    if (location === '/home' && isUserValorizzato(user)) {
      redirectAfterLogin(router, user as UserI);
    }
  }, [location, user, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    setEmailOptions([]);
    window.addEventListener("resize", handleResize);


    // Pulisci il listener al dismount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!FACEBOOK_LOGIN_VISIBLE) {
      return;
    }
    const appId = CLIENT_FACEBOOK.APP_ID;
    if (!appId || facebookSdkInitRef.current) {
      return;
    }
    facebookSdkInitRef.current = true;
    (window as unknown as { fbAsyncInit?: () => void }).fbAsyncInit = () => {
      const FB = (window as unknown as { FB?: { init: (c: object) => void } }).FB;
      if (FB) {
        FB.init({
          appId,
          cookie: true,
          xfbml: false,
          version: "v19.0",
        });
      }
    };
    const id = "facebook-jssdk";
    if (document.getElementById(id)) {
      return;
    }
    const js = document.createElement("script");
    js.id = id;
    js.src = "https://connect.facebook.net/it_IT/sdk.js";
    js.async = true;
    js.defer = true;
    const fbs = document.getElementsByTagName("script")[0];
    fbs?.parentNode?.insertBefore(js, fbs);
  }, []);



  const handleConfirm = ((typeSimulated: number, emailUserCurrent: string) => {
    currentUser.email = emailLogin;
    currentUser.emailChild = emailConfirmDialog;
    currentUser.type = typeSimulated;
    currentUser.emailUserCurrent = emailUserCurrent;
    completeLogin(toUserI({ ...currentUser, type: typeSimulated as TypeUser }));
    handleCloseD();

  });

  // Funzione di logout
  const logOut = () => {
    setUser(null); // Resetta il profilo utente
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Funzioni di gestione
  const handleOpenD = () => setOpenD(true);
  const handleCloseD = () => setOpenD(false);
  const handleEmailChange = (event: SelectChangeEvent) => {
    setEmailConfirmDialog(event.target.value);
  };

  // Configura useGoogleLogin
  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => {

      const accessToken = codeResponse?.access_token;
      // Puoi usare l'access token per fare richieste all'API di Google
      fetchUserData(accessToken);

    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
  });



  const handleLoginSuccessFake = (loginType: TypeUser) => {
    const currentUser =
      loginType === TypeUser.STANDARD
        ? { ...userDataChildFake, type: TypeUser.STANDARD }
        : { ...userDataFake, type: TypeUser.FAMILY };
    getToken(
      { email: currentUser.emailUserCurrent, password: "password", googleLogin: false },
      (message: any) => showMessage(setOpen, setMessage, message, true)
    ).then((tokenData) => {
      baseStore.setToken(tokenData?.jsonText?.token);
      setCurrentUser({ _id: undefined, ...currentUser });
      showDialog(loginType, false);
    });
  };

  const showDialog = (loginType: TypeUser, googleAuth: boolean, userDataGoogle?: any): void => {
    const currentUser = googleAuth
      ? { ...userDataGoogle, emailChild: userDataGoogle.email }
      : loginType === TypeUser.STANDARD
        ? { ...userDataChildFake, type: TypeUser.STANDARD }
        : { ...userDataFake, type: TypeUser.FAMILY };
    openHome(currentUser, googleAuth, setLoading);
  };

  const openHome = (currentUser: any, googleAuth: boolean, setLoading: any): Promise<any> => {
    const loginTypeBefore = currentUser.type;
    return getEmailChild({ ...currentUser, email: currentUser.emailChild }).then((x: ResponseI | undefined) => {
      const emailChild = x?.jsonText?.emailFigli ?? [];
      setEmailOptions(emailChild);
      if (loginTypeBefore === TypeUser.FAMILY) {
        currentUser.type = emailChild?.length > 0 ? currentUser.type : 2;
      }
    }).then(x => {
      getTypeUser(currentUser, () => showMessage(setOpen, setMessage, message, true), setLoading).then((x) => {
        setEmailLogin(x?.jsonText?.emailUserCurrent ?? '');
        switch (x?.jsonText?.typeUser) {
          case TypeUser.STANDARD: {
            setEmailLogin(currentUser.email ?? "");
            setSimulated(TypeUser.STANDARD);
            const loggedUser = toUserI({
              ...currentUser,
              type: x.jsonText.typeUser,
              name: currentUser.name,
              emailChild: currentUser.emailChild || currentUser.emailUserCurrent,
              emailUserCurrent: x.jsonText.emailUserCurrent ?? currentUser.emailUserCurrent,
            });
            const pending = x?.jsonText?.pendingParentEmails as string[] | undefined;
            if (pending && pending.length > 0) {
              const sel: Record<string, boolean> = {};
              pending.forEach((p) => {
                sel[p] = true;
              });
              setPendingParentsSelected(sel);
              setPendingParentsEmails(pending);
              setPendingDialogChildEmail(x.jsonText.emailUserCurrent ?? currentUser.emailUserCurrent ?? '');
              setOpenPendingParentsDialog(true);
              completeLogin(loggedUser, { deferRedirect: true });
            } else {
              completeLogin(loggedUser);
            }
            break;
          }
          case TypeUser.FAMILY: {
            setEmailLogin(currentUser.email ?? '');
            setSimulated(TypeUser.FAMILY);
            handleOpenD();
            break;
          }
          case TypeUser.NEW_USER: {
            if (googleAuth === true) {
              completeLogin(
                toUserI({
                  ...currentUser,
                  type: x.jsonText.typeUser,
                  emailUserCurrent: x.jsonText.emailUserCurrent,
                })
              );
            } else {
              completeLogin(toUserI({ ...currentUser, type: TypeUser.NEW_USER }));
            }
          }
            break;
        }
      })
    })
  }

  // Funzione per ottenere i dati utente
  const fetchUserData = async (accessToken: string) => {
    try {
      // Verifica che il token sia valido
      const tokenInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
      const tokenInfo = await tokenInfoResponse.json();
      if (tokenInfo.error) {
        console.error('Token invalido:', tokenInfo.error);
        return;
      }
      // Se il token è valido, recupera i dati dell'utente
      const userDataResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (userDataResponse.ok) {
        const userDataGoogle = await userDataResponse.json();
        userDataGoogle.emailUserCurrent = userDataGoogle.email;
        userDataGoogle.emailChild = userDataGoogle.email;
        getToken({
          email: userDataGoogle.emailUserCurrent,
          googleLogin: true,
          googleAccessToken: accessToken
        }, (message: any) => showMessage(setOpen, setMessage, message, true)).then(tokenData => {
          baseStore.setToken(tokenData?.jsonText?.token);
          setEmailLogin(userDataGoogle.email ?? '');

          //setUser({ ...userData, type: 1 });
          setCurrentUser(userDataGoogle);
          showDialog(1, true, userDataGoogle);
        })

      } else {
        console.error('Failed to fetch user data:', userDataResponse.status);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  }

  const completeGithubLogin = async (code: string) => {
    const redirectUri = getGitHubOAuthRedirectUri();
    if (!redirectUri) {
      return;
    }
    try {
      const tokenData = await getToken(
        {
          githubLogin: true,
          githubCode: code,
          githubRedirectUri: redirectUri,
        },
        (message: any) => showMessage(setOpen, setMessage, message, true),
        setLoading,
      );
      const email = tokenData?.jsonText?.email as string | undefined;
      const token = tokenData?.jsonText?.token as string | undefined;
      if (!email || !token) {
        return;
      }
      baseStore.setToken(token);
      const userDataGithub: CurrentUserState = {
        _id: undefined,
        email,
        emailUserCurrent: email,
        emailChild: email,
        name: email.split("@")[0] ?? email,
        type: TypeUser.FAMILY,
      };
      setEmailLogin(email);
      setCurrentUser(userDataGithub);
      showDialog(1, true, userDataGithub);
    } catch (error) {
      console.error("Error completing GitHub login", error);
    }
  };

  /** Callback GitHub = `/home`: il popup torna su Home con ?code=; inoltra all’opener e chiude. */
  useEffect(() => {
    if (location !== "/home" || typeof window === "undefined") {
      return;
    }
    if (!window.opener) {
      return;
    }
    if (githubHomePopupBridgeDoneRef.current) {
      return;
    }
    const p = new URLSearchParams(window.location.search);
    const err = p.get("error");
    if (err) {
      githubHomePopupBridgeDoneRef.current = true;
      window.opener.postMessage(
        { type: "github-oauth", error: err, errorDescription: p.get("error_description") },
        window.location.origin,
      );
      window.close();
      return;
    }
    const code = p.get("code");
    const state = p.get("state");
    if (!code || !state) {
      return;
    }
    githubHomePopupBridgeDoneRef.current = true;
    window.opener.postMessage({ type: "github-oauth", code, state }, window.location.origin);
    window.close();
  }, [location]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (event.data?.type !== "github-oauth") {
        return;
      }
      if (event.data?.error) {
        showMessage(setOpen, setMessage, {
          titleMessage: "GitHub",
          typeMessage: TypeAlertColor.ERROR,
          message: [String(event.data.errorDescription ?? event.data.error)],
        });
        return;
      }
      if (
        event.data?.code &&
        event.data?.state === githubOAuthStateRef.current &&
        getGitHubOAuthRedirectUri()
      ) {
        void completeGithubLogin(String(event.data.code));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const startGithubLogin = () => {
    const redirectUri = getGitHubOAuthRedirectUri();
    if (!CLIENT_GITHUB.SERVER || !redirectUri) {
      showMessage(setOpen, setMessage, {
        titleMessage: "GitHub",
        typeMessage: TypeAlertColor.ERROR,
        message: [
          "Configura NEXT_PUBLIC_CLIENT_GITHUB_ID. Per produzione imposta anche NEXT_PUBLIC_GITHUB_OAUTH_REDIRECT_URI (es. https://…/home). In locale su localhost la redirect è …/home sulla porta corrente se la variabile è vuota; registra su GitHub tutte le URL usate (es. :3000/home e :3001/home).",
        ],
      });
      return;
    }
    const state = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    githubOAuthStateRef.current = state;
    const url =
      `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(CLIENT_GITHUB.SERVER)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent("user:email")}` +
      `&state=${encodeURIComponent(state)}`;
    window.open(url, "github_oauth", "width=520,height=720");
  }

  const fetchFacebookUserData = async (accessToken: string) => {
    try {
      const userDataResponse = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(accessToken)}`,
      );
      const userDataFacebook = await userDataResponse.json();
      if (!userDataResponse.ok || !userDataFacebook.email) {
        console.error("Facebook userinfo", userDataFacebook);
        showMessage(setOpen, setMessage, {
          titleMessage: "Facebook",
          typeMessage: TypeAlertColor.ERROR,
          message: [userDataFacebook.error?.message ?? "Email non disponibile da Facebook"],
        });
        return;
      }
      userDataFacebook.emailUserCurrent = userDataFacebook.email;
      userDataFacebook.emailChild = userDataFacebook.email;
      userDataFacebook.type = TypeUser.FAMILY;
      getToken(
        {
          email: userDataFacebook.emailUserCurrent,
          facebookLogin: true,
          facebookAccessToken: accessToken,
        },
        (message: any) => showMessage(setOpen, setMessage, message, true),
        setLoading,
      ).then((tokenData) => {
        baseStore.setToken(tokenData?.jsonText?.token);
        setEmailLogin(userDataFacebook.email ?? "");
        setCurrentUser(userDataFacebook);
        showDialog(1, true, userDataFacebook);
      });
    } catch (error) {
      console.error("Error fetching Facebook user data", error);
    }
  };

  const handleFacebookLogin = (): void => {
    if (!CLIENT_FACEBOOK.APP_ID) {
      showMessage(setOpen, setMessage, {
        titleMessage: "Facebook",
        typeMessage: TypeAlertColor.ERROR,
        message: ["Configura NEXT_PUBLIC_CLIENT_FACEBOOK_APP_ID"],
      });
      return;
    }
    const FB = (window as unknown as { FB?: { login: (cb: (r: unknown) => void, o?: { scope: string }) => void } })
      .FB;
    if (!FB) {
      showMessage(setOpen, setMessage, {
        titleMessage: "Facebook",
        typeMessage: TypeAlertColor.ERROR,
        message: ["SDK Facebook non ancora caricato, riprova tra un secondo."],
      });
      return;
    }
    FB.login(
      (response: unknown) => {
        const r = response as {
          authResponse?: { accessToken?: string };
          status?: string;
        };
        if (r.status === "connected" && r.authResponse?.accessToken) {
          void fetchFacebookUserData(r.authResponse.accessToken);
        }
      },
      { scope: "email" },
    );
  };

  // Simulazione del login con Google
  const simulateLogin = (type: number) => {
    setSimulated(type);
    handleLoginSuccessFake(type);


  };

  const handleChangeUsername = (event: any): void => {
    setEmailLogin(event.target.value);
  }

  const handleChangePassword = (event: any): void => {
    setPasswordLogin(event.target.value);
  }

  const togglePasswordVisibility = (event: any): void => {
    setShowPassword((prev) => !prev);

  }

  const handleLogin = (event: any): void => {
    const emailNormalized = emailLogin.trim().toLowerCase();
    if (demoPanelOpen && !isSimulatedDemoEmail(emailNormalized)) {
      showMessage(setOpen, setMessage, {
        typeMessage: TypeAlertColor.WARNING,
        titleMessage: i18n._('accedi'),
        message: [i18n._('home_account_login_email_only_simulated')],
      });
      return;
    }
    const user = { _id: undefined, email: emailLogin, password: passwordLogin }
    getToken({ email: user.email, password: user.password, googleLogin: false }, (message: any) => showMessage(setOpen, setMessage, message, true)).then(tokenData => {
      baseStore.setToken(tokenData?.jsonText?.token);
      oldLogin(user).then(x => {
        if (x?.jsonText?.type !== undefined && x?.jsonText?.type !== null) {
          const currentUser = x.jsonText;
          openHome(currentUser, false, setLoading)
        }
      })
    })
  }

  const handleKeepLoggedIn = (event: any): void => {
    throw new Error('Function not implemented.');
  }

  const handleOpenResetDialog = (): void => {
    setResetEmail(emailLogin || '');
    setOpenResetDialog(true);
  };

  const handleCloseResetDialog = (): void => {
    setOpenResetDialog(false);
  };

  const handleClosePendingParentsDialog = (): void => {
    setOpenPendingParentsDialog(false);
    if (isUserValorizzato(user)) {
      redirectAfterLogin(router, user as UserI);
    }
  };

  const handlePendingParentToggle = (parentEmail: string): void => {
    setPendingParentsSelected((prev) => ({ ...prev, [parentEmail]: !prev[parentEmail] }));
  };

  const handleSavePendingParents = (): void => {
    const selected = pendingParentsEmails.filter((e) => pendingParentsSelected[e]);
    void confirmParentLinks(
      { emailUserCurrent: pendingDialogChildEmail, confirmParentEmails: selected },
      (dialogMessage?: TypeMessage) => showMessage(setOpen, setMessage, dialogMessage, true),
      setLoading,
    ).then(() => {
      setOpenPendingParentsDialog(false);
      if (isUserValorizzato(user)) {
        redirectAfterLogin(router, user as UserI);
      }
    });
  };

  const handleConfirmResetPassword = (): void => {
    const email = resetEmail.trim();
    if (!email) {
      showMessage(setOpen, setMessage, {
        typeMessage: TypeAlertColor.ERROR,
        titleMessage: i18n._("password_reset_title"),
        message: [i18n._("password_reset_email_required")],
      });
      return;
    }

    if (!emailRegex.test(email)) {
      showMessage(setOpen, setMessage, {
        typeMessage: TypeAlertColor.ERROR,
        titleMessage: i18n._("password_reset_title"),
        message: [i18n._("password_reset_email_invalid")],
      });
      return;
    }

    if (isSimulatedDemoEmail(email)) {
      showMessage(setOpen, setMessage, {
        typeMessage: TypeAlertColor.WARNING,
        titleMessage: i18n._("password_reset_title"),
        message: [i18n._("home_password_reset_not_simulated")],
      });
      return;
    }

    resetPassword(
      { emailUserCurrent: email },
      (dialogMessage?: TypeMessage) => showMessage(setOpen, setMessage, dialogMessage, true),
      setLoading
    ).then(() => {
      setOpenResetDialog(false);
    });
  };

  return (
    <>
      <div className="layout-alert layout-alert-spaced flex justify-end">
        {open && <Alert onClose={handleClose} message={message} />}
      </div>

      <div className="home-page-shell">
        <div className="home-page-main">
          <div className="welcome-container1">
            <div className="login-paper rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
              <div className="box-pulsanti-login mb-6">
                {!hiddenLogin && (
                  <>
                    {demoPanelOpen ? (
                      <Button
                        variant="outline"
                        className="home-demo-toggle-button home-demo-toggle-button--account w-full"
                        onClick={() => setDemoPanelOpen(false)}
                      >
                        <Trans id="home_demo_back" />
                      </Button>
                    ) : (
                      <Button
                        className="home-demo-toggle-button home-demo-toggle-button--demo w-full"
                        onClick={() => setDemoPanelOpen(true)}
                      >
                        <Trans id="home_demo_link" />
                      </Button>
                    )}
                    {demoPanelOpen && (
                      <div className="home-demo-panel mt-4">
                        <div className="grid grid-cols-1 gap-3">
                          <Button
                            onClick={() => simulateLogin(TypeUser.STANDARD)}
                            className="simulated-login-button w-full"
                          >
                            <Trans id="login_simulato_utente_base" />
                          </Button>
                          <Button
                            onClick={() => simulateLogin(TypeUser.FAMILY)}
                            className="simulated-login-button w-full"
                          >
                            <Trans id="login_simulato_utente_parentale" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="box-login mb-4">
                <FormField
                  id="username"
                  label={i18n._("indirizzo_email")}
                  value={emailLogin ?? ""}
                  onChange={handleChangeUsername}
                />
              </div>

              <div className="mb-4">
                <PasswordField
                  id="password"
                  label={i18n._("password")}
                  value={passwordLogin}
                  onChange={handleChangePassword}
                  showPassword={showPassword}
                  onToggleVisibility={() => setShowPassword((prev) => !prev)}
                  toggleLabel={showPassword ? i18n._("nascondi_password") : i18n._("mostra_password")}
                />
              </div>

              <Button className="login-button w-full" onClick={handleLogin}>
                <Trans id="accedi" />
              </Button>

              <div className="register-annotation mt-4 space-y-2">
                {!demoPanelOpen && (
                  <p className="text-sm">
                    <Trans id="nuovo_account" />{" "}
                    <LinkNext href="/register" className="register-link underline">
                      <Trans id="registrati" />
                    </LinkNext>
                  </p>
                )}
                <p className="personality-annotation text-sm">
                  <LinkNext href="/personality" className="register-link underline">
                    {i18n._("personality_discover_link")}
                  </LinkNext>
                </p>
                {!demoPanelOpen && (
                  <p className="personality-annotation text-sm">
                    <button
                      type="button"
                      className="register-link reset-password-link underline"
                      onClick={handleOpenResetDialog}
                    >
                      {i18n._("password_reset_link")}
                    </button>
                  </p>
                )}
              </div>

              <div className="box-accedi my-4 flex items-center gap-3">
                <Separator className="box-accedi-divider flex-1" />
                <span className="box-accedi-text text-sm text-[var(--color-text-muted)]">
                  <Trans id="oppure_accedi_con" />
                </span>
                <Separator className="box-accedi-divider flex-1" />
              </div>

              <div
                className={
                  demoPanelOpen
                    ? "home-social-grid home-social-grid--disabled flex justify-center gap-4"
                    : "home-social-grid flex justify-center gap-4"
                }
              >
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={startGithubLogin}
                  className="social-button github-button"
                  disabled={demoPanelOpen || !CLIENT_GITHUB.SERVER || !getGitHubOAuthRedirectUri()}
                  aria-label="GitHub"
                >
                  <GitHubBrandIcon />
                </Button>
                {FACEBOOK_LOGIN_VISIBLE && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleFacebookLogin}
                    className="social-button"
                    disabled={demoPanelOpen || !CLIENT_FACEBOOK.APP_ID}
                    aria-label="Facebook"
                  >
                    <span className="text-sm font-bold">f</span>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="social-button google-button"
                  onClick={() => login()}
                  disabled={demoPanelOpen || !CLIENT_GOOGLE.SERVER}
                  aria-label="Google"
                >
                  <GoogleBrandIcon />
                </Button>
              </div>

              <DialogEmail
                openD={openD}
                handleCloseD={handleCloseD}
                emailOptions={emailOptions}
                handleEmailChange={handleEmailChange}
                handleConfirm={handleConfirm}
                email={emailConfirmDialog}
                simulated={simulated}
                emailUserCurrent={emailLogin}
              />

              <Dialog open={openResetDialog} onOpenChange={(next) => !next && handleCloseResetDialog()}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{i18n._("password_reset_title")}</DialogTitle>
                  </DialogHeader>
                  <FormField
                    id="reset-password-email"
                    label={i18n._("indirizzo_email")}
                    type="email"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                    autoFocus
                  />
                  <DialogFooter>
                    <Button variant="ghost" onClick={handleCloseResetDialog}>
                      {i18n._("annulla")}
                    </Button>
                    <Button onClick={handleConfirmResetPassword}>{i18n._("password_reset_send")}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={openPendingParentsDialog}
                onOpenChange={(next) => !next && handleClosePendingParentsDialog()}
              >
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{i18n._("parent_link_confirm_title")}</DialogTitle>
                    <DialogDescription>{i18n._("parent_link_confirm_description")}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    {pendingParentsEmails.map((pe) => (
                      <div key={pe} className="flex items-center gap-3">
                        <Checkbox
                          checked={Boolean(pendingParentsSelected[pe])}
                          onCheckedChange={() => handlePendingParentToggle(pe)}
                        />
                        <Label>{pe}</Label>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={handleClosePendingParentsDialog}>
                      {i18n._("annulla")}
                    </Button>
                    <Button onClick={handleSavePendingParents}>{i18n._("parent_link_confirm_save")}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {loading && (
            <div className="mt-8 flex justify-center">
              <Loader2 className="size-8 animate-spin text-[var(--color-primary)]" />
            </div>
          )}
        </div>

        {!hiddenLogin && (
          <div className="tech-wrapper">
            <TechFooter />
          </div>
        )}
      </div>
    </>
  );

};




export default HomeContent;
