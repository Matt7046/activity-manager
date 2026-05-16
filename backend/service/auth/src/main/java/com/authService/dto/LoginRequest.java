package com.authService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
    private Boolean googleLogin;
    private String googleAccessToken;

    /** OAuth GitHub (web flow): code + redirect_uri devono coincidere con l'app GitHub. */
    private Boolean githubLogin;
    private String githubCode;
    private String githubRedirectUri;

    /** OAuth Facebook: stesso schema di Google (email da Graph + access token utente). */
    private Boolean facebookLogin;
    private String facebookAccessToken;
}
