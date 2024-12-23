package com.webapp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webapp.dto.ResponseDTO;
import com.webapp.dto.ActivityDTO;
import com.webapp.service.ActivityService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController

@RequestMapping("api/about")
public class AboutController {

    @Autowired
    private ActivityService ActivityService;

    @DeleteMapping("/{identificativo}")
    public ResponseDTO deleteByIdentificativo(@PathVariable String identificativo) {
        Long item = null;
        List<String> errori = new ArrayList<>();
        ResponseDTO responseDTO;

        try {
            item = ActivityService.deleteByIdentificativo(identificativo);
            if (item.equals(0L)) {
                throw new RuntimeException("Documento non trovato con identificativo: " + identificativo);
            }
            // Activity item = new Activity();

        } catch (Exception e) {
            errori.add(e.getMessage());
        }
        ActivityDTO subDTO = new ActivityDTO(); // Inizializza DTO vuoto
        subDTO.set_id(identificativo);
        if (item !=null && !item.equals(0L)) {
            // Mappatura se l'oggetto è stato trovato
            responseDTO = new ResponseDTO(subDTO, HttpStatus.OK, new ArrayList<>());
        } else {
            // Risposta in caso di errore o elemento non trovato
            responseDTO = new ResponseDTO(subDTO, HttpStatus.NOT_FOUND, errori); // 404 con dettagli errore
        }
        return responseDTO;

    }

    @PostMapping("/dati")
    public ResponseEntity<ResponseDTO> saveActivity(@RequestBody ActivityDTO activityDTO) {
        try {
            // Salva i dati e ottieni l'ID o l'oggetto salvato
            String itemId = ActivityService.saveActivity(activityDTO);

            // Crea una risposta
            ResponseDTO response = new ResponseDTO(itemId, HttpStatus.OK, new ArrayList<>());

            // Ritorna una ResponseEntity con lo status HTTP
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Gestione degli errori: puoi personalizzarlo in base al tuo scenario
            List<String> errori = new ArrayList<>();
            errori.add(e.getMessage());
            errori.add(e.getLocalizedMessage());
            ResponseDTO errorResponse = new ResponseDTO(null, HttpStatus.INTERNAL_SERVER_ERROR, errori);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

}
