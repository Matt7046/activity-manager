package com.common.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class NotificationDTO implements InterfaceDTO {

    private String serviceName;
    private String userSender;
    private String userReceiver;
    private String message;
    private Date dateSender;

}
