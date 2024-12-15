package com.webapp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webapp.data.SubPromise;
import com.webapp.dto.ResponseDTO;
import com.webapp.dto.SubPromiseDTO;
import com.webapp.mapper.SubPromiseMapper;
import com.webapp.service.SubPromiseService;

import java.util.ArrayList;
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

    @GetMapping("")
    public ResponseDTO getTesto() {

        // String[] texts = { "Ciao, mondo!", "Benvenuto in Java", "Programmazione è
        // divertente" };
        List<SubPromise> sub = subPromiseService.findAll();
        // mapping
        List<SubPromiseDTO> subDTO = sub.stream()
                .map(SubPromiseMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());

        ResponseDTO response = new ResponseDTO(subDTO, HttpStatus.OK, new ArrayList<>());
        return response;
    }

    @GetMapping("/{identificativo}")
    public ResponseDTO findByIdentificativo(@PathVariable String identificativo) {
        List<String> errori = new ArrayList<>();
        SubPromise item = null; // Inizializza l'oggetto come null
        ResponseDTO responseDTO;
    
        try {
            // Tentativo di trovare il documento
            item = subPromiseService.findByIdentificativo(identificativo);
            if (item == null) {
                throw new RuntimeException("Documento non trovato con identificativo: " + identificativo);
            }
        } catch (Exception e) {
            // Gestione dell'errore: log e aggiunta dei dettagli
            errori.add("Errore: " + e.getMessage());
        }
    
        if (item != null) {
            // Mappatura se l'oggetto è stato trovato
            SubPromiseDTO subDTO = SubPromiseMapper.INSTANCE.toDTO(item);
            responseDTO = new ResponseDTO(subDTO, HttpStatus.OK, new ArrayList<>());
        } else {
            // Risposta in caso di errore o elemento non trovato
            SubPromiseDTO subDTO = new SubPromiseDTO(); // Inizializza DTO vuoto
            responseDTO = new ResponseDTO(subDTO, HttpStatus.NOT_FOUND, errori); // 404 con dettagli errore
        }
    
        return responseDTO;
    }
    

}
