package com.webapp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webapp.data.SubPromise;
import com.webapp.dto.ResponseDTO;
import com.webapp.dto.SubPromiseDTO;
import com.webapp.mapper.SubPromiseMapper;
import com.webapp.service.SubPromiseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("api/about")
@CrossOrigin(origins = "http://localhost:3000")
public class AboutController {

    @Autowired
    private SubPromiseService subPromiseService;

 
    @DeleteMapping("/{identificativo}")
    public ResponseDTO deleteByIdentificativo(@PathVariable Long identificativo) {
        Long item = subPromiseService.deleteByIdentificativo(identificativo);
    //SubPromise item  = new SubPromise();
   
        return new ResponseDTO(item, HttpStatus.OK);
    }
}
