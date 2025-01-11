package com.activityManager.exception;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.activityManager.dto.ResponseDTO;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ArithmeticCustomException.class)
    public ResponseEntity<ResponseDTO>  handleUserNotFound(ArithmeticCustomException ex) {
        List<String> errori = new ArrayList<>();
        errori.add(ex.getMessage());
        ResponseDTO errorResponse = new ResponseDTO(null, HttpStatus.INTERNAL_SERVER_ERROR, errori);
        return ResponseEntity.ok(errorResponse);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ResponseDTO>  handleUserNotFound(NotFoundException ex) {
        List<String> errori = new ArrayList<>();
        errori.add(ex.getMessage());
        ResponseDTO errorResponse = new ResponseDTO(null, HttpStatus.NOT_FOUND, errori);
        return ResponseEntity.ok(errorResponse);
    }

    @ExceptionHandler(DecryptException.class)
    public ResponseEntity<ResponseDTO>  handleUserNotFound(DecryptException ex) {
        List<String> errori = new ArrayList<>();
        errori.add(ex.getMessage());
        ResponseDTO errorResponse = new ResponseDTO(null, HttpStatus.FORBIDDEN, errori);
        return ResponseEntity.ok(errorResponse);
    }


    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseDTO>  handleAllExceptions(Exception ex) {
        List<String> errori = new ArrayList<>();
        errori.add("Errore generico: " + ex.getMessage());
        ResponseDTO errorResponse = new ResponseDTO(null, HttpStatus.NOT_FOUND, errori);
        return ResponseEntity.ok(errorResponse);
    }

}