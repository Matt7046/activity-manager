package com.common.dto.user;

import com.common.dto.structure.InterfaceDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
public class UserPointWithChildDTO implements InterfaceDTO {

    private UserPointDTO userPoint; // Identificatore unico
    private List<UserPointDTO> userPointChild;
    /** Email figli aggiunti (chiaro), per email di conferma al genitore. */
    private List<String> addedChildEmailsPlain;

}
