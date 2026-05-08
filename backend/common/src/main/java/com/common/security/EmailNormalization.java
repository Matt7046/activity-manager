package com.common.security;

import java.util.Locale;

public final class EmailNormalization {

    private EmailNormalization() {
    }

    public static String normalize(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
