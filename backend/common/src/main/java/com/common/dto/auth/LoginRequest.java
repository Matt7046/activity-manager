package com.common.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class LoginRequest {
    private String email;
    private String password;
    private Boolean googleLogin;
    private String googleAccessToken;

    /** OAuth GitHub (web flow): code + redirect_uri devono coincidere con l’app GitHub. */
    private Boolean githubLogin;
    private String githubCode;
    private String githubRedirectUri;

    /** OAuth Facebook: stesso schema di Google (email da Graph + access token utente). */
    private Boolean facebookLogin;
    private String facebookAccessToken;

    // Getter e Setter
}