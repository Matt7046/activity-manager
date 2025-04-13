package com.common.dto;

import com.common.data.OperationTypeLogFamily;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class LogFamilyDTO implements  InterfaceDTO {
    private String _id;
    private String performedByEmail;
    private String receivedByEmail;
    private String log;
    private Date  date;
    private OperationTypeLogFamily operations;
    private UserPointDTO point;

}
