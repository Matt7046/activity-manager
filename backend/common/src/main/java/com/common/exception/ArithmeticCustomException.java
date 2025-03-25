package com.common.exception;


public class ArithmeticCustomException extends ArithmeticException {
    public ArithmeticCustomException() {
        super("Operazione non possibile");
    }
    public ArithmeticCustomException(String message) {
        super(message);
    }  

}
