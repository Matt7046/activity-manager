package com.common.structure.exception;


public class ArithmeticCustomException extends ArithmeticException {
    public ArithmeticCustomException() {
        super("operazione_non_possibile");
    }
    public ArithmeticCustomException(String message) {
        super(message);
    }  

}
