package com.common.dto.notification;

import java.util.Date;

import com.common.data.notification.StatusNotification;
import com.common.dto.structure.InterfaceDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class NotificationDTO implements InterfaceDTO {

    private String _id;
    private String serviceName;
    private String userSender;
    private String userReceiver;
    private String message;
    private Date dateSender;
    private StatusNotification Status;

}
