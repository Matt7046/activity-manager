package com.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class ActivityDTO implements InterfaceDTO {

    private String _id; // Identificatore unico
    private String subTesto;
    private String nome;
    private String logAttivita;
    private Long points;
    private String email;
}
