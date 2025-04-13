package com.common.data.family;


import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum OperationTypeLogFamily {
    OPERATIVE(1),
    FAMILY_ADD(2),
    FAMILY_REMOVE(3);

    private final int value;

    public int value() {
        return value;
    }

    public static OperationTypeLogFamily fromValue(Integer code) {
        for (OperationTypeLogFamily op : values()) {
            if (op.value() == code) {
                return op;
            }
        }
        throw new IllegalArgumentException(code.toString());
    }
}
