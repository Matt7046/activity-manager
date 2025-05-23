package com.common.dto.family;

import com.common.dto.notification.NotificationDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class FamilyNotificationDTO extends NotificationDTO {

    private String pointsNew;

}
