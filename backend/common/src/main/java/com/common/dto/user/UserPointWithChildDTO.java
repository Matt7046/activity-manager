package com.common.dto.user;

import com.common.dto.structure.InterfaceDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class UserPointWithChildDTO implements InterfaceDTO {

    private UserPointDTO userPoint; // Identificatore unico
    private List<UserPointDTO> userPointChild;

}
