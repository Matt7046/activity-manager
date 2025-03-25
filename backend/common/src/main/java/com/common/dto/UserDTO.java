package com.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class UserDTO implements InterfaceDTO  {

	private Long typeUser; // Identificatore unico
    private Boolean newUser;
	

	

}
