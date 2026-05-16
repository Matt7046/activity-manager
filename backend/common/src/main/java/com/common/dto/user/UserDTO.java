package com.common.dto.user;

import java.util.List;

import com.common.dto.structure.InterfaceDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class UserDTO implements InterfaceDTO {

    private Integer typeUser; // Identificatore unico
    private Boolean newUser;
    private String emailUserCurrent;
    /** Solo per tipo figlio (0): genitori con link in attesa di conferma. */
    private List<String> pendingParentEmails;

}
