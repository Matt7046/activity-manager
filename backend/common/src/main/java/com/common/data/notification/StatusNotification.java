package com.common.data.notification;


import lombok.AllArgsConstructor;

@AllArgsConstructor // Genera un costruttore con tutti i campi
public enum StatusNotification {
    READ(1),
    NOT_READ(2),
    SEND(3);

    private final int value;

    public int value() {
        return value;
    }

    public static StatusNotification fromValue(Integer code) {
        for (StatusNotification op : values()) {
            if (op.value() == code) {
                return op;
            }
        }
        throw new IllegalArgumentException(code.toString());
    }
}
