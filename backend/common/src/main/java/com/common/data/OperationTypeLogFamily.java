package com.common.data;

import com.mongodb.client.model.changestream.OperationType;

public enum OperationTypeLogFamily {
    OPERATIVE(1),
    FAMILY_ADD(2),
    FAMILY_REMOVE(3);

    private final int code;

    OperationTypeLogFamily(Integer code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static OperationTypeLogFamily fromCode(Integer code) {
        for (OperationTypeLogFamily op : values()) {
            if (op.getCode() == code) {
                return op;
            }
        }
        throw new IllegalArgumentException(code.toString());
    }
}
