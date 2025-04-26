package com.common.dto.user;

import java.util.List;

import com.common.dto.structure.InterfaceDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class UserPointDTO implements InterfaceDTO {

    private String _id; // Identificatore unico
    private String email;
    private String password;
    private Integer type;
    private List<PointDTO> pointFigli;
    private String numeroPunti;
    private Integer usePoints;
    private List<String> emailFigli;
    private Boolean operation;
    private String emailUserCurrent;
    private Integer page;
    private Integer size;
    private String field;
    private Boolean unpaged;
    private String nameImage;


}
