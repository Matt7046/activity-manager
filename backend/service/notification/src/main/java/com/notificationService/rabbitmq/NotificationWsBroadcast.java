package com.notificationService.rabbitmq;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Messaggio interno fanout: ogni replica notification-service lo riceve e inoltra
 * {@code payload} alle proprie sessioni WebSocket locali.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationWsBroadcast {

    private String notificationId;
    private String payload;
}
