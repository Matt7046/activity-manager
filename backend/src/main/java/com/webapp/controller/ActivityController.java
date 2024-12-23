package com.webapp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webapp.data.Activity;
import com.webapp.data.LogAttivita;
import com.webapp.dto.ResponseDTO;
import com.webapp.dto.ActivityDTO;
import com.webapp.dto.PointsDTO;
import com.webapp.mapper.ActivityMapper;
import com.webapp.mapper.LogAttivitaMapper;
import com.webapp.service.ActivityService;
import com.webapp.service.PointsService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private PointsService pointsService;

    @GetMapping("")
    public ResponseDTO getTesto() {

        // String[] texts = { "Ciao, mondo!", "Benvenuto in Java", "Programmazione è
        // divertente" };
        List<Activity> sub = activityService.findAll();
        // mapping
        List<ActivityDTO> subDTO = sub.stream()
                .map(ActivityMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());

        ResponseDTO response = new ResponseDTO(subDTO, HttpStatus.OK, new ArrayList<>());
        return response;
    }

    @GetMapping("/{identificativo}")
    public ResponseDTO findByIdentificativo(@PathVariable String identificativo) {
        List<String> errori = new ArrayList<>();
        Activity item = null; // Inizializza l'oggetto come null
        ResponseDTO responseDTO;
    
        try {
            // Tentativo di trovare il documento
            item = activityService.findByIdentificativo(identificativo);
            if (item == null) {
                throw new RuntimeException("Documento non trovato con identificativo: " + identificativo);
            }
        } catch (Exception e) {
            // Gestione dell'errore: log e aggiunta dei dettagli
            errori.add("Errore: " + e.getMessage());
        }
    
        if (item != null) {
            // Mappatura se l'oggetto è stato trovato
            ActivityDTO subDTO = ActivityMapper.INSTANCE.toDTO(item);
            responseDTO = new ResponseDTO(subDTO, HttpStatus.OK, new ArrayList<>());
        } else {
            // Risposta in caso di errore o elemento non trovato
            ActivityDTO subDTO = new ActivityDTO(); // Inizializza DTO vuoto
            responseDTO = new ResponseDTO(subDTO, HttpStatus.NOT_FOUND, errori); // 404 con dettagli errore
        }
    
        return responseDTO;
    }
    
    @PostMapping("/log")
    public ResponseEntity<ResponseDTO> logActivityByEmail(@RequestBody PointsDTO pointsDTO) {
        try {
            // Salva i dati e ottieni l'ID o l'oggetto salvato
            List<LogAttivita> sub = pointsService.logAttivitaByEmail(pointsDTO);
            List<String> logAttivitaUnica = sub.stream()
            .map(LogAttivitaMapper.INSTANCE::toCastDTO) // Converte ogni elemento in ActivityDTO
            .map(ActivityDTO::getLogAttivita) // Estrae il campo logAttivita
            .collect(Collectors.toList());
            // Crea una risposta
            ResponseDTO response = new ResponseDTO(logAttivitaUnica, HttpStatus.OK, new ArrayList<>());

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
