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
    private String emailChild;
    private String password;
    private Integer points;
    private List<PointDTO> pointFigli;
    private List<String> emailFigli;
    private Integer type;
    private String numeroPunti;
    private Integer usePoints;
    private String nameImage;
    private Boolean operation;
    private String emailUserCurrent;
    private Integer page;
    private Integer size;
    private String field;
    private Boolean unpaged;
}
