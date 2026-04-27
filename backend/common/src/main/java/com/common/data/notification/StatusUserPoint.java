package com.common.data.notification;


import lombok.AllArgsConstructor;

@AllArgsConstructor // Genera un costruttore con tutti i campi
public enum StatusUserPoint{
    ACTIVE(1),
    DISACTIVE(2); 

    private final int value;

    public int value() {
        return value;
    }

    public static StatusUserPoint fromValue(Integer code) {
        for (StatusUserPoint op : values()) {
            if (op.value() == code) {
                return op;
            }
        }
        throw new IllegalArgumentException(code.toString());
    }
}
