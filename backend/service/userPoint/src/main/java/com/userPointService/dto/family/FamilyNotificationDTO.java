package com.userPointService.dto.family;

import com.common.dto.notification.NotificationDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FamilyNotificationDTO extends NotificationDTO {

    private String pointsNew;
}
