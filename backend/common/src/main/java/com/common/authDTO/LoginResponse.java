package com.common.authDTO;



import com.common.dto.InterfaceDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class LoginResponse implements InterfaceDTO {
    private String token;

}