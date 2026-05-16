package com.common.data.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Collegamento genitore–figlio: email cifrata (come in {@code emailFigli}) e conferma lato figlio per quel genitore. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FiglioLink {
    private String email;
    private Boolean check;
}
