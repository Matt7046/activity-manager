package com.common.structure.handler;

import java.util.ArrayList;
import java.util.List;

import com.common.structure.status.ActivityHttpStatus;
import com.common.structure.exception.ArithmeticCustomException;
import com.common.structure.exception.DecryptException;
import com.common.structure.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.common.dto.structure.ResponseDTO;


@ControllerAdvice
public class GlobalExceptionHandler {
    @Value("${message.error.generic}")
    private String messageErrorGeneric;

    @ExceptionHandler(ArithmeticCustomException.class)
    public ResponseEntity<ResponseDTO>  handleArithmeticCustomException(ArithmeticCustomException ex) {
        List<String> error = new ArrayList<>();
        error.add(ex.getMessage());
        ResponseDTO errorResponse = new ResponseDTO(null, ActivityHttpStatus.ARITHMETIC.value(), error);
        return ResponseEntity.ok(errorResponse);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ResponseDTO>  handleNotFoundException(NotFoundException ex) {
        List<String> error = new ArrayList<>();
        error.add(ex.getMessage());
        ResponseDTO errorResponse = new ResponseDTO(null, ActivityHttpStatus.DATABASE_ERROR.value(), error);
        return ResponseEntity.ok(errorResponse);
    }

    @ExceptionHandler(DecryptException.class)
    public ResponseEntity<ResponseDTO>  handleDecryptException(DecryptException ex) {
        List<String> error = new ArrayList<>();
        error.add(ex.getMessage());
        ResponseDTO errorResponse = new ResponseDTO(null, ActivityHttpStatus.DECRYPT.value(), error);
        return ResponseEntity.ok(errorResponse);
    }


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseDTO>  handleAllExceptions(Exception ex) {
        StringBuilder builder = new StringBuilder();
        List<String> error = new ArrayList<>();
        builder.append(messageErrorGeneric).append(ex.getMessage());
        error.add( builder.toString());
        ResponseDTO errorResponse = new ResponseDTO(null, ActivityHttpStatus.INTERNAL_SERVER_ERROR.value(), error);
        return ResponseEntity.ok(errorResponse);
    }

}