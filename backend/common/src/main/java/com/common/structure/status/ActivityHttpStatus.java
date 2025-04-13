package com.common.structure.status;

import lombok.AllArgsConstructor;

@AllArgsConstructor // Genera un costruttore con tutti i campi
public enum ActivityHttpStatus {

    DECRYPT(1),
    ARITHMETIC(2),
    OK(200),
    INTERNAL_SERVER_ERROR(500),
    DATABASE_ERROR(401);

    private final int value;

    public int value() {
        return value;
    }

    public static ActivityHttpStatus fromValue(Integer code) {
        for (ActivityHttpStatus op : values()) {
            if (op.value() == code) {
                return op;
            }
        }
        throw new IllegalArgumentException(code.toString());
    }
}
