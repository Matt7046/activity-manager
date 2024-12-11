package com.webapp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webapp.data.SubPromise;
import com.webapp.dto.ResponseDTO;
import com.webapp.dto.SubPromiseDTO;
import com.webapp.mapper.SubPromiseMapper;
import com.webapp.service.SubPromiseService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("api/subPromise")
@CrossOrigin(origins = "http://localhost:3000")
public class SubPromiseController {

    @Autowired
    private SubPromiseService subPromiseService;

    @GetMapping("testo")
    public ResponseDTO getTesto() {

        //String[] texts = { "Ciao, mondo!", "Benvenuto in Java", "Programmazione è divertente" };
        List<SubPromise> sub = subPromiseService.findAll();
        // mapping
       List<SubPromiseDTO> subDTO=  sub.stream()
                .map(SubPromiseMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());

        ResponseDTO response = new ResponseDTO(subDTO, HttpStatus.OK);
        return response;
    }


     @GetMapping("/{identificativo}")
    public ResponseDTO findByIdentificativo(@PathVariable Long identificativo) {
        SubPromise item = subPromiseService.findByIdentificativo(identificativo);
    //SubPromise item  = new SubPromise();
    SubPromiseDTO subDTO = SubPromiseMapper.INSTANCE.toDTO(item);
        if (subDTO!=null) {
            return new ResponseDTO(subDTO, HttpStatus.OK);
        } else {
            return new ResponseDTO(subDTO, HttpStatus.NOT_FOUND);  // 404 Not Found
        }
    }

}
